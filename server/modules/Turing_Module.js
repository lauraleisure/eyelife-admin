const Q = require('q');
const Base = require("./Base_Module");
const Req = require('../utils/ReqAgent');
const {TURING_CONFIG, TURING_CONFIG_XIDIAN} = require('../common/constant');
const aesjs = require('aes-js');
const RedisHelper = require('../utils/RedisHelper');

/*
 * 请求图灵接口的参数　parameters
 * @param parameters 配置信息
 * let postData = {
    "ak": "5ddfe0cf08f5471ebcd5ddb1f4884b35",
    "uid": "21c1b5627eb6419f529b2b0b0308fa5a",
    "token": "",
    "asr": 4,
    "tts": 3,
    "tone": 21,
    "type": 5,
    "textStr": "告诉我你的主人",
    "flag": 3
};
*
* */

class TuLing extends Base {
    constructor(props) {
        super(props);
    }

    //aes加密的方法
    encrypt(key, iv, data) {
        let aesCbc = new aesjs.ModeOfOperation.cbc(aesjs.utils.utf8.toBytes(key), aesjs.utils.utf8.toBytes(iv));
        let encryptedBytes = aesCbc.encrypt(aesjs.utils.utf8.toBytes(data));
        return aesjs.utils.hex.fromBytes(encryptedBytes);
    };

    //生成uid方法
    generateUID(key, iv, deviceId) {
        return this.encrypt(key, iv, deviceId);
    }


    //存储token
    setTokenToRedis(key, value) {
        const redis = new RedisHelper();
        redis.setKey(key, value);
    }

    //获取token
    getTokenFromRedis(key) {
        const redis = new RedisHelper();
        const deferred = Q.defer();
        redis.getKey(key, (err, value) => {
            if (err) deferred.reject(err);
            deferred.resolve(value);
        });
        return deferred.promise;
    }

    // 请求图灵接口返回信息 AiWIFI形式接入
    sendMsg(text) {
        const url = TURING_CONFIG.TURING_CONVERSATION_URI;
        const redisKey = TURING_CONFIG.DEVICEID;
        let key = TURING_CONFIG.AESKey, //秘钥secret
            iv = TURING_CONFIG.AES_IV,    //密钥偏移量aes_iv, 取apiKey的前16位字符
            deviceId = TURING_CONFIG.DEVICEID,
            ak = TURING_CONFIG.TURING_KEY,
            uid = this.generateUID(key, iv, deviceId);
        return this.replyMe(redisKey, ak, uid, text, url);
    }


    // 请求图灵接口返回信息 AiWIFI形式接入
    xidianTuring(text) {
        const url = TURING_CONFIG_XIDIAN.TURING_CONVERSATION_URI;
        const redisKey = TURING_CONFIG_XIDIAN.DEVICEID;
        let key = TURING_CONFIG_XIDIAN.AESKey, //秘钥secret
            iv = TURING_CONFIG_XIDIAN.AES_IV,    //密钥偏移量aes_iv, 取apiKey的前16位字符
            deviceId = TURING_CONFIG_XIDIAN.DEVICEID,
            ak = TURING_CONFIG_XIDIAN.TURING_KEY,
            uid = this.generateUID(key, iv, deviceId);
        return this.replyMe(redisKey, ak, uid, text, url);
    }

    replyMe(redisKey, ak, uid, text, url) {
        //获取token
        const req = new Req();
        return this.getTokenFromRedis(redisKey)
            .then((value) => {
                let postData = {
                    "ak": ak,
                    "uid": uid,
                    "token": value || '',
                    "asr": 4,
                    "tts": 3,
                    "tone": 21,
                    "type": 5,
                    "textStr": text,
                    "flag": 3
                };
                return req.httpRequestForTuLing(url, postData)
                    .then(response => {
                        let rs = JSON.parse(response);
                        let out = {
                            text: "亲爱的，你至少说点什么吧",
                            audio: ""
                        };
                        if (rs.code !== 40007 && rs.code !== 40003) {
                            out.text = rs.tts;
                            let _audio = rs.nlp[0];
                            out.audio = _audio.replace('http://', 'https://');
                            // 存储token到redis
                            this.setTokenToRedis(redisKey, rs.token);
                        }
                        return out;
                    })
            })
    }


}


module.exports = TuLing;

