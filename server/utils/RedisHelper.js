"use strict";

const redis = require('redis');
const RedisSettings = require('../config').RedisSettings;


class RedisHelper {

    initClient() {
        let client;
        client = redis.createClient(RedisSettings.port, RedisSettings.host);
        client.on('error', (err) => {
            console.log('Error: ' + err);
        });
        return client;
    }

    setKey(key, value) {
        let client = this.initClient();
        client.set(key, value);
        client.quit();
    }

    getKey(key, callback) {
        let client = this.initClient();
        client.get(key, (err, value) => {
            callback(err, value);
            client.quit();
        });
    }

}

module.exports = RedisHelper;



