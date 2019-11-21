/**
 * 这个类严禁require User类
 */
const Q = require('q');
const _ = require('lodash');
const Rst = require('./Rst_Module');
const moment = require('moment')
const Helper = require('../utils/TokenHelper');
const TokenSettings = require('../common/constant_system').TokenSettings;
const Base = require('./Base_Module')

const extractTokenFromHeader = function (headers) {
    if (headers == null) throw this.error('Header is null');
    if (headers.authorization == null) throw this.error('Authorization header is null');

    var authorization = headers.authorization;
    var authArr = authorization.split(' ');
    if (authArr.length != 2) throw this.error('Authorization header value is not of length 2');

    // retrieve token
    var token = authArr[1];

    return token;
};

class Token extends Base {
    constructor(props) {
        super(props)
        this.prepareModel('Token');
    }

    //验证token
    verifyToken(token) {
        let _this = this;
        return this.findOne({
            currentToken: token,
            tokenExpires: {
                $gt: moment().toDate()
            }
        }).then(function (token) {
            if (!token) throw _this.error('token无效!', 90010);
            return token;
        })
    }

    verifyTokenFromHeader(header) {
        var that = this;
        return Q.fcall(function () {
            let token = extractTokenFromHeader(header);
            return that.verifyToken(token);
        })
    }


    //创建token
    issueToken(userId, extraInfo, req) {
        let that = this;
        return Q.fcall(function () {
            //1. 验证userId是否为ObjectId
            return that.ObjectId(userId);
        }).then(function (userObjId) {
            //2. 生成token
            return Helper.generateRandomToken().then(function (token) {
                //3.向token表中插入数据
                let tk = {}
                tk.currentToken = token;
                tk.tokenExpires = Helper.generateNewExpire();
                tk.userID = userObjId;
                tk.ipAddress = req.hostname;
                tk.ipsProxy = req.proxy;
                tk.userAgent = req.useragent;
                _.extend(tk, {
                    deviceID: TokenSettings.DefaultDeviceId,
                    deviceType: TokenSettings.DefaultDeviceType,
                    clientVersion: TokenSettings.DefaultClientVersion,
                }, extraInfo);
                return that.save(tk).then(function (token) {
                    return token;
                });
            })
        });
    }

    //token延期
    extendToken(curToken) {
        return this.findOneAndUpdate({
            currentToken: curToken
        }, {
            $set: {
                tokenExpires: Helper.generateNewExpire()
            }
        });
    }

    //根据userId与deviceID获取token
    //deviceID可以为空
    searchTokenByUserIdAndDeviceId(userId, deviceID) {
        let _search = {
            userID: userId,
            tokenExpires: {
                $gt: moment().toDate()
            }
        }
        if (deviceID) {
            _search.deviceID = deviceID;
        }
        return this.findOne(_search);
    }

    //删除token
    removeToken(currentToken) {
        return this.findOneAndRemove({
            currentToken
        });
    }
}

module.exports = Token;
