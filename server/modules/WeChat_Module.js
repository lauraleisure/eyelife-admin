const Base = require('./Base_Module');
const Q = require('q');
const _ = require('lodash');
const ReqAgent = require('../utils/ReqAgent');
const CONSTANT_WX = require('../common/constant_wx');


class WeChat extends Base {
    constructor(props) {
        super(props);
    }

    getMaterials(pageCount, pageSize) {
        //获取accessToken
        const agent = new ReqAgent();
        let URL = agent.buildUriWithParams(CONSTANT_WX.WX_URI.WX_GET_ACCESSTOKEN.URI, [CONSTANT_WX.WX_APP.xidian_xcx.appid, CONSTANT_WX.WX_APP.xidian_xcx.appsecret]);
        return agent.get(URL)
            .then(d => {
                if (d && d.access_token) {
                    //生成二维码
                    let accessToken = d.access_token;
                    let POST_URL = agent.buildUriWithParams(CONSTANT_WX.WX_URI.WX_GET_MATERIAL.URI, [accessToken]);
                    let _offset = pageCount * pageSize;
                    let postData = {
                        "type": "news", //素材类型图片（image）、视频（video）、语音 （voice）、图文（news）
                        "offset": _offset, //从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
                        "count": pageSize //返回素材的数量，取值在1到20之间
                    };
                    return agent.httpRequestSpecial(POST_URL, postData, 'POST')
                        .then(rs => {
                            return rs;
                        })
                }
            })

    }
}


module.exports = WeChat;
