const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const Base = require('./Base_Module');
const RequestAgent = require('../utils/ReqAgent');
const WX_APP = require('../config').WX_APP;
const WxConstant = require('../common/constant_wx');
const WX_URI = WxConstant.WX_URI;
const Token = require('./Token_Module');

//比较2个wxUserInfo是否有差异
//以newInfo为准
//返回true表示有差异，false表示无差异
const compareInfoBetweenWxUsers = function (existingInfo, newInfo) {
    if (!existingInfo) {
        return true;
    }
    let changed = false;
    for (var i in newInfo) {
        if (existingInfo[i] !== newInfo[i]) {
            changed = true;
            break;
        }
    }
    return changed;
}

class User extends Base {
    constructor(props) {
        super(props);
        this.prepareModel('User');
    }

    //根据appkey与code获取微信用户的openid及session_key
    requestWxForOpenId(appKey, code) {
        //跑case用数据，正常使用需关闭
        // return Q({
        //     openId: 'o2NR45K6IctAdmLQnOh22hMLGD1s',
        //     appId: 'wx09394444f517f994',
        //     session_key: 'eezOTqg0yT77RQ++Ynfqhw==',
        //     unionId: ''
        // });

        let that = this;
        return Q.fcall(function () {
            if (!WX_APP[appKey]) {
                throw that.error('Cannot find WX config for:' + appKey, 90001)
            }
            let wxAppCfg = WX_APP[appKey];
            let reqAgent = new RequestAgent();
            let _url = reqAgent.buildUriWithParams(WX_URI.WX_JSCODE2SESSION.URI, [wxAppCfg.appid, wxAppCfg.appsecret, code]);
            return reqAgent.get(_url).then(function (res) {
                if (!res.errcode) {
                    //正确返回
                    return {
                        openId: res.openid,
                        appId: wxAppCfg.appid,
                        session_key: res.session_key,
                        unionId: res.unionid || ''
                    }
                }

                if (res.errmsg) {
                    //如有其他微信问题，抛错
                    throw that.error(res.errmsg, 90002);
                }
            });
        });
    }

    //通过openId与appId获取user
    loadUserByOpenIdAndAppId(openId, appId) {
        return this.findOne({
            wx_user: {
                $elemMatch: {
                    "openId": openId,
                    "appId": appId
                }
            }
        });
    }

    //验证微信用户信息合法性
    validateWxUserInfo(wxUserInfo) {
        let that = this;
        return Q.fcall(function () {
            //校验openId与appId是否都有值
            if (!wxUserInfo.openId || !wxUserInfo.appId) {
                throw that.error('未获取到用户的微信标识信息', 90003);
            }
        });
    }

    //根据微信信息，创建全新的用户数据
    createNewUser(wxUserInfo) {
        /* 
        "openId": "OPENID",
        "appId": "APPID",
        "nickName": "NICKNAME",
        "gender": GENDER,
        "city": "CITY",
        "province": "PROVINCE",
        "country": "COUNTRY",
        "avatarUrl": "AVATARURL",
        "unionId": "UNIONID",
        */
        let that = this;
        return this.validateWxUserInfo(wxUserInfo).then(function () {
            let userInfo = {
                nick_name: wxUserInfo.nickName,
                phone: '',
                avatar: wxUserInfo.avatarUrl,
                wx_user: [
                    wxUserInfo
                ]
            }

            return that.save(userInfo).then(function (user) {
                return user;
            });
        })
    }

    findUserById(userId) {
        let that = this;
        return this.findBy(userId).then(function (doc) {
            if (!doc) {
                throw that.error('用户不存在', 93004);
            }
            return doc;
        })
    }

    //根据appKey,code,微信用户信息,客户端传回的信息,以及req构建用户及token
    //@appKey, @code用于获取微信Openid
    //@wxUserInfo，用于构建user时填充wx_user字段
    //@req,@systemData 用于构建token
    wxAutoLogin(appKey, code, wxUserInfo, systemData, req) {
        var that = this;
        return this.requestWxForOpenId(appKey, code).then(function (userPrivates) {
            //1. 微信处理，通过appKey与code去微信换取openid等信息
            delete userPrivates.session_key;
            _.extend(wxUserInfo, userPrivates);
        }).then(function () {
            //2. 处理user
            return that.loadUserByOpenIdAndAppId(wxUserInfo.openId, wxUserInfo.appId).then(function (doc) {
                if (doc) {
                    //查询到用户已存在,无需创建用户
                    //根据wxUserInfo自动处理user数据
                    return that.autoProcessUserInfo(doc, wxUserInfo).then(function () {
                        //返回userId
                        return doc._id;
                    });
                }
                //创建新user
                return that.createNewUser(wxUserInfo).then(function (newUserDoc) {
                    return newUserDoc._id;
                })
            });
        }).then(function (userId) {
            //3. 处理token
            let _token = new Token();
            return _token.searchTokenByUserIdAndDeviceId(userId, systemData.deviceId).then(function (tokenDoc) {
                if (tokenDoc) {
                    //如果有已存在的token，直接返回
                    return tokenDoc.currentToken;
                }
                return _token.issueToken(userId, systemData, req).then(function (newCreated) {
                    return newCreated.currentToken;
                });
            })
        });
    }

    //从wx_user中获取指定openId的项
    getWxInfoFromWxUserListByOpenId(wxUserList, openId) {
        for (let i = 0; i < wxUserList.length; i++) {
            if (openId === wxUserList[i].openId) {
                return wxUserList[i];
            }
        }
        return null;
    }


    compareUserInfoAndAutoUpdate(userDoc, existingWxUserInfo, NewWxUserInfo) {
        var that = this;
        return Q.fcall(function () {
            let changed = compareInfoBetweenWxUsers(existingWxUserInfo, NewWxUserInfo);
            if (changed) {
                //如果信息发生了变化，更新user信息
                _.extend(existingWxUserInfo, NewWxUserInfo);
                return that.update({
                    _id: userDoc._id,
                    'wx_user.openId': NewWxUserInfo.openId
                }, {
                    $set: {
                        nick_name: NewWxUserInfo.nickName,
                        avatar: NewWxUserInfo.avatarUrl,
                        'wx_user.$': NewWxUserInfo
                    }
                });
            }
        });
    }

    //根据小程序端传回的信息处理User
    //如user信息与传回的微信信息一致，表明微信信息未更新，不动作
    //如微信信息与user相比发生了变化，则需要更新user信息
    autoProcessUserInfo(userDoc, wxUserInfo) {
        let that = this;
        return Q.fcall(function () {
            let _wxUserList = userDoc.wx_user;
            let _wxUserSaved = that.getWxInfoFromWxUserListByOpenId(_wxUserList, wxUserInfo.openId);
            if (_wxUserSaved) {
                return that.compareUserInfoAndAutoUpdate(userDoc, _wxUserSaved, wxUserInfo);
            }
        });
    }

    exchangeUserByToken(token) {
        let that = this;
        let _token = new Token();
        return _token.findOne({
            currentToken: token,
            tokenExpires: {
                $gt: moment().toDate()
            }
        }, {
            userID: 1
        }).then(function (doc) {
            if (!doc) {
                throw that.error('Invalid Token', 9302);
            }
            return doc.userID;
        }).then(function (userId) {
            return that.findUserById(userId);
        });
    }


    updateUserInfoByCode(userDoc, appKey, code, wxUserInfo) {
        var that = this;
        return this.requestWxForOpenId(appKey, code).then(function (userPrivates) {
            //1. 微信处理，通过appKey与code去微信换取openid等信息
            delete userPrivates.session_key;
            _.extend(wxUserInfo, userPrivates);
        }).then(function () {
            //2. 处理user
            return that.autoProcessUserInfo(userDoc, wxUserInfo);
        })
    }

    //快速比较新传入的微信信息与已有信息是否一致
    //一致则不动作，不一致则更新
    //仅当user的wx_list只有一个元素时使用
    quickUpdateUserInfoByWxUserInfo(userDoc, wxUserInfo) {
        var that = this;
        return Q.fcall(function () {
            if (!userDoc.wx_user || !userDoc.wx_user[0]) {
                return;
            }
            let _existing = userDoc.wx_user[0];
            return that.compareUserInfoAndAutoUpdate(userDoc, _existing, wxUserInfo);
        });
    }

}


module.exports = User;
