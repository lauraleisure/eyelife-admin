const Q = require('q');
const crypto = require('crypto');
const moment = require('moment');
const Settings = require('../common/constant_system').TokenSettings;

exports.generateRandomToken = function () {
    let deferred = Q.defer();
    crypto.randomBytes(256, deferred.makeNodeResolver());
    return deferred.promise.then(function (buffer) {
        return crypto.createHash('sha1').update(buffer).digest('hex');
    });
};

exports.extractTokenFromHeader = function (headers) {
    if (headers == null) throw new Error('Header is null');
    if (headers.authorization == null) throw new Error('Authorization header is null');

    var authorization = headers.authorization;
    var authArr = authorization.split(' ');
    if (authArr.length != 2) throw new Error('Authorization header value is not of length 2');

    // retrieve token
    var token = authArr[1];
    return token;
};

exports.generateNewExpire = function () {
    return moment().add(Settings.TokenSavePeriod, 'day').toDate();
}
