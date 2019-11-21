'use strict';


module.exports = {
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
        host: "redis.prod.localdomain",
        port: 6379,
        expires: 60 * 60,
    },
    gen_token_secret: 'qianmen-api',
    ApiServerAddress: "https://qm-api.cheweilai.cn",
    WebServerAddress: "https://qm-web.cheweilai.cn"
};
