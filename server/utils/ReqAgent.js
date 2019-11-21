const Q = require('q');
const request = require('request');
const _ = require('lodash');

class httpAgent {
    httpRequest(url, parmas, method, certificate) {
        let auth = "";
        if (certificate && certificate.token) {
            auth = 'Bearer ' + certificate.token;
        } else if (certificate && certificate.username && certificate.password) {
            auth = 'Basic ' + new Buffer(certificate.username + ':' + certificate.password).toString('base64');
        }
        parmas = parmas || {};
        var deferred = Q.defer();
        request({
            uri: url,
            method: method,
            json: true,
            headers: {
                "Authorization": auth,
            },
            body: parmas
        }, (err, response, body) => {
            if (err) { //网络错误，api无法连接
                err.code = 500; //区分api返回的500错误
                err.statusCode = 500001;
                err.error = true;
                deferred.reject(err);
                return;
            }
            deferred.resolve(body);
        })
        return deferred.promise;
    }

    //微信小程序生成二维码
    httpRequestSpecial(url, parmas, method) {
        parmas = parmas || {};
        var deferred = Q.defer();
        request({
            uri: url,
            method: method,
            json: true,
            headers: {
                "content-type": 'application/json'
            },
            encoding: null,//接受二进制流
            body: parmas
        }, (err, response, body) => {
            if (err) { //网络错误，api无法连接
                err.code = 500; //区分api返回的500错误
                err.statusCode = 500001;
                err.error = true;
                deferred.reject(err);
                return;
            }
            deferred.resolve(body);
        })
        return deferred.promise;
    }


    httpRequestForTuLing(url, params) {
        var deferred = Q.defer();
        request.post({url: url, form: {"parameters": JSON.stringify(params)}}, (err, httpResponse, body) => {
            if (err) { //网络错误，api无法连接
                err.code = 500; //区分api返回的500错误
                err.statusCode = 500001;
                err.error = true;
                deferred.reject(err);
                return;
            }
            deferred.resolve(body);
        });
        return deferred.promise;
    }


    post(url, parmas, certificate) {
        return this.httpRequest(url, parmas, "POST", certificate);
    }

    get(url, parmas, certificate) {
        return this.httpRequest(url, parmas, "GET", certificate);
    }

    buildUriWithParams(uriStr, params) {
        for (var i = 0; i < params.length; i++) {
            uriStr = uriStr.replace("{" + i + "}", params[i]);
        }
        return uriStr;
    }

}

module.exports = httpAgent;
