"use strict";


const raw = (args) => {
    let keys = Object.keys(args);
    keys = keys.sort();
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key] = args[key];
    });
    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

let wxpay = {

    //把金额转为分
    getmoney: function (money) {
        return parseFloat(money) * 100;
    },

    // 随机字符串产生函数
    createNonceStr: function () {
        return Math.random().toString(36).substr(2, 15);
    },

    // 时间戳产生函数
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    //签名加密算法
    paysignJSAPI: function (signData, mchkey) {
        let string = raw(signData);
        let key = mchkey;
        string += '&key=' + key;
        let crypto = require('crypto');
        return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    },

};


module.exports = wxpay;
