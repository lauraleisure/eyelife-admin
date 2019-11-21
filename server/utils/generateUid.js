"use strict";

let aesjs = require('aes-js');


/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
let encrypt = function (key, iv, data) {
    let aesCbc = new aesjs.ModeOfOperation.cbc(aesjs.utils.utf8.toBytes(key), aesjs.utils.utf8.toBytes(iv));
    let encryptedBytes = aesCbc.encrypt(aesjs.utils.utf8.toBytes(data));
    return aesjs.utils.hex.fromBytes(encryptedBytes);
};


// let key = '3262644314jK6157';
// console.log('加密的key:', key);
// let iv = '5ddfe0cf08f5471e';
// console.log('加密的iv:', iv);
// let data = "ai11223344551188";
// console.log("需要加密的数据:", data);
// let crypted = encrypt(key, iv, data);
// console.log("数据加密后:", crypted);

module.exports = {
    encrypt
};

