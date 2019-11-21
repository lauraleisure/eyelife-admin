const TokenModule = require('./Token_Module');
const tools = require('../utils/tools');
const Base = require('./Base_Module');
const Q = require('q');

class Admin extends Base {
    constructor(props) {
        super(props);
        this.prepareModel('AdminUser');
    }

    createUser(username, password, role_id) {
        return this.findOne({username})
            .then(user => {
                if (user) {
                    throw this.error('用户名已存在!', 90007)
                }
                return tools.hashPassWord(password)
                    .then(hashpass => {
                        let data = {
                            username,
                            role_id,
                            password: hashpass,
                        };
                        return this.save(data)
                    })
            })
    }

    updateUser(_id, data) {
        var that = this;
        return Q(null).then(function () {
            return that.findOne({_id: that.ObjectId(_id)}).then(function (user) {
                if(!user) throw that.error('用户不存在!', 90007);
                if (data.username && data.username != user.username) {
                    return that.findOne({'username': data.username})
                        .then(info => {
                            if (info) {
                                throw that.error('用户名已存在!', 90007)
                            }else{
                                user.username = data.username;
                                return user;
                            }
                        })
                }
                return user;
            });
        }).then(function (user) {
            if (data.password) {
                return tools.hashPassWord(data.password).then(function(hash){
                    user.password = hash;
                    return user;
                });
            }
            return user;
        }).then(function (user) {
            if (data.role_id) {
                user.role_id = that.ObjectId(data.role_id);
            }
            return that.update({_id: that.ObjectId(_id)}, {$set: user}).then(function () {
                return user;
            });
        });
    }

    adminUser(id) {
        return this.findOne({_id: id})
            .then((user) => {
                if (!user) throw this.error('用户不存在!', 90008);
                return user;
            })
    }

    login(username, password, req) {
        return this.findOne({username})
            .then(user => {
                if (!user) throw this.error('用户不存在!');
                return tools.verifyPassword(password, user.password)
                    .then(result => {
                        if (!result) throw this.error('密码错误!', 90009);
                        //密码验证成功
                        //生成token　
                        const _token = new TokenModule();
                        const systemData = {
                            deviceID: 'qianmen',
                            deviceType: "admin",
                            clientVersion: "1.0"
                        };
                        return _token.searchTokenByUserIdAndDeviceId(user._id).then(function (tokenDoc) {
                            if (tokenDoc) {
                                //如果有已存在的token，直接返回
                                user = user.toObject();
                                user.token = tokenDoc.currentToken
                                return user;
                            }
                            return _token.issueToken(user._id, systemData, req).then(function (newCreated) {
                                user = user.toObject();
                                user.token = newCreated.currentToken;
                                return user;
                            });
                        })
                    })
            })
    }

    getUserList(filter) {
        var that = this;
        var page = that.formatPagingParams(filter.pageSize, filter.pageCount, 20);
        var time = that.getPeriod(filter.startTime, filter.endTime);
        var _filter = {
            create_time: {
                $gt: time.start.toDate(),
                $lt: time.end.toDate()
            },
            username: {
                $regex: filter.username
            },
        };
        if (filter.role) {
            if (that.isValidObjectId(filter.role)) {
                _filter.role_id = that.ObjectId(filter.role);
            }
            throw that.error('数据格式错误!');
        }
        var qlist = [];
        qlist.push(that.populates(_filter, null, [
            ['role_id', 'role_name desc']
        ], {_id: -1}, page.skip, page.limit));
        qlist.push(that.count(_filter));
        return Q.all(qlist).spread(function (list, count) {
            return {list: list, count: count};
        });
    }
}


module.exports = Admin;
