const bcrypt = require('bcrypt');
const saltRounds = 10;
const Q = require('q');
const Jwt = require('jsonwebtoken');
const {jwt_secret, jwt_expires} = require('../common/constant_system').jwt;
const uuid = require('uuid');


const hashPassWord = function (password) {
    let deferred = Q.defer();
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) deferred.reject(err);
        deferred.resolve(hash);
    });
    return deferred.promise;

};

const verifyPassword = function (password, hash) {
    let deferred = Q.defer();
    bcrypt.compare(password, hash, function (err, result) {
        if (err) deferred.reject(err);
        deferred.resolve(result);
    });
    return deferred.promise;
};

const generateJwtTokenSync = function (rule) {
    let token;
    if (rule) {
        token = Jwt.sign(rule, jwt_secret, {expiresIn: jwt_expires});
    } else {
        token = Jwt.sign({jwtToken: jwt_secret}, jwt_secret, {expiresIn: jwt_expires});
    }
    return token;
};

const verifyJwtToken = function (token, cb) {
    Jwt.verify(token, jwt_secret, function (err, decoded) {
        if (err === null && decoded !== undefined) {
            cb(err, true);
        } else {
            cb(err, false);
        }
    });
};

const genResId = function () {
    var buff = new Buffer(16);
    uuid.v1(null, buff, null);
    return buff.toString('hex');
};

const genCdnImageUrl = function (imageHost, url) {
    var _slash = '/';
    if (/^\//.test(url)) _slash = '';
    // 处理公有图片地址
    if (imageHost == config.ImageHost.imagePub) {
        var _reg = /^((http)|(https)):\/\/((7-imgpub)|(imgpub)|(image))\.(huanchezu|51huanche)\.com\//;
        url = url.replace(_reg, '');
        // 如果url中有thumbnail参数，则使用七牛的图片地址
        if (/thumbnail/.test(url)) {
            return policy.makeRequest(imageHost + _slash + url);
        } else {
            return imageHost + _slash + url + '-normal';
        }
    }
    // 其它情况
    else {
        return url;
    }
};



module.exports = {
    hashPassWord,
    verifyPassword,
    generateJwtTokenSync,
    verifyJwtToken,
    genResId,
    genCdnImageUrl
};
