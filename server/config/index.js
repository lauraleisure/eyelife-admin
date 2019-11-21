'use strict';

const _ = require('lodash');

const _default = {
    MongoSettings: {
        mongodb: 'mongodb://qianmen:qianmeN0808@172.16.200.152:27017,172.16.200.153:27017,172.16.200.154:27017/qianmen?replicaSet=foobar',
        options: {
            useNewUrlParser: true,
            useCreateIndex: true,
            keepAlive: 1,
            poolSize: 10,
            promiseLibrary: require('q').Promise
        }

    },
    RedisSettings: {
        host: "127.0.0.1",
        port: 6379,
        expires: 60 * 60
    },
    bucket :"https://res.51huanche.com",
    gen_token_secret: 'qianmen-api',
    ApiServerAddress: "https://qm-api.cheweilai.cn",
    WebServerAddress: "https://qm-web.cheweilai.cn",
    WX_APP: {
        qianmen_xcx: {
            type: 'miniprogram',
            // appid: 'wx09394444f517f994',
            appid: 'wxa8ad6a4caf21eebb',
            // appsecret: "97e59cefd287d3e73f16196c1ea9c7f2",
            appsecret: "5f54bfdd776565ab8ff100421e21941e",
            custom_name: "huanke"
        }
    },
    qiniu: { //todo
        root: 'https://res.51huanche.com/',
        ACCESS_KEY: 'vBgY4FtrytAhXESocWtDg8OuiNb1LKyKa81IHjqN',
        SECRET_KEY: '2wvowFlO5HQnNgEO74Tr7Xm-lpY41u73nNDc4iqu',
        uploadUrls: {'content': 'http://up-z1.qiniu.com/'},
        defBuckets: 'content'
    },
    ImageHost: { //todo
        imagePub: "https://7-imgpub.51huanche.com" //公有地址
    },

    AudioHost: { //todo
        audio: "https://audio.51huanche.com"
    },

};

const env = process.env.NODE_ENV == undefined ? 'development' : process.env.NODE_ENV;

module.exports = _.extend(_default, require('./' + env + '.js') || {});
