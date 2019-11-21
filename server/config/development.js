'use strict';


module.exports = {
    MongoSettings: {
        mongodb: 'mongodb://qianmen:qianmeN0808@172.16.100.150,172.16.100.151,172.16.100.152/qianmen?replicaSet=foobar',
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
        expires: 60 * 60,
    },
    gen_token_secret: 'qianmen-api',
    ApiServerAddress: "https://t-qm-api.cheweilai.cn",
    WebServerAddress: "https://t-qm-web.cheweilai.cn"
};
