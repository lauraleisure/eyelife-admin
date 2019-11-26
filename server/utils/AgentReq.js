"use strict";

const request = require('request');
const Jwt = require('../tools/jwt');
const Q = require('q');
const {API_SERVER} = require('../../config');



class httpAgent {
    httpRequest(url, parmas, method, token) {
        let _token = 'Jwt ' + Jwt.generateJwtToken();
        if(token){
            _token = 'Bearer ' + token
        }
        parmas = parmas || {};
        var deferred = Q.defer();
        request({
            uri: API_SERVER + url,
            method: method,
            json: true,
            headers: {
                "Authorization": _token
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
        });
        return deferred.promise;
    }

    post(url, parmas) {
        return this.httpRequest(url, parmas, "POST");
    }
    auth_post(url, parmas,token) {
        return this.httpRequest(url, parmas, "POST",token);
    }

    get(url, parmas) {
        let queryArr = [];
        for (let key in parmas) {
            queryArr.push(`${key}=${parmas[key]}`);
        }
        let str = queryArr.join('&');
        url += '?' + str;

        return this.httpRequest(url, parmas, "GET");
    }

    auth_get(url, params, token){
            let queryArr = [];
            for (let key in params) {
                queryArr.push(`${key}=${params[key]}`);
            }
            let str = queryArr.join('&');
            url += '?' + str;
            return this.httpRequest(url, params, "GET", token);
    }
}

module.exports = httpAgent;



