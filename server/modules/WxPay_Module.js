const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const Base = require('./Base_Module');
const WXCONSTANT = require('../common/constant_wx');
const {generateNonceString} = require('../utils/genereateString');
const {generateTradNo, generateTrainTradNO} = require('../utils/generateTradNo');
const ReqAgent = require('../utils/ReqAgent');
const wxpay = require('../utils/wxpay');
const TouristOrder = require('./TouristOrder_Module');
const User = require('./User_Module');
const TopicOrder = require('./TopicOrder_Module');


class WxPay extends Base {
    /*
    *
    *
    timeStamp	String	是	时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
    nonceStr	String	是	随机字符串，长度为32个字符以下。
    package	String	是	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
    signType	String	是	签名类型，默认为MD5，支持HMAC-SHA256和MD5。注意此处需与统一下单的签名类型一致
    paySign	String	是	签名,具体签名方案参见微信公众号支付帮助文档;
    success	Function	否	接口调用成功的回调函数
    fail	Function	否	接口调用失败的回调函数
    complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
    *
    *
    * */
    /*
    *
    appId: appId,
    timeStamp: _timeStamp,
    nonceStr: _nonceStr,
    package: _package,
    signType: 'MD5',
    paySign: _paySign,
    *
    * */

    //利用用户openid请求微信下单接口返回订单号

    getOpenIdByUserId(userId) {
        const user = new User();
        return user.findOne({_id: userId})
            .then(user => {
                let idx = user.wx_user.length - 1;
                return user.wx_user[idx].openId;
            })
    }

    //生成统一签名sign
    gensignature(bizType, openId, nonceStr, bodyData, totalFee, clientIp, tradeNo) {
        let appid = WXCONSTANT.WX_APP.qianmen_xcx.appid,
            mch_id = WXCONSTANT.WX_PAY_CONFIG.mch_id,
            nonce_str = nonceStr,
            body = bodyData,
            out_trade_no = tradeNo,
            total_fee = totalFee,
            spbill_create_ip = clientIp || '127.0.0.1',
            notify_url = WXCONSTANT.WX_PAY_CONFIG.notify_url + `${bizType}/${tradeNo}`,
            trade_type = WXCONSTANT.WX_PAY_CONFIG.trade_type,
            openid = openId,
            mchkey = WXCONSTANT.WX_PAY_CONFIG.partner_key;

        //首先生成签名sign
        let signData = {
            appid,
            mch_id,
            nonce_str,
            body,
            out_trade_no,
            total_fee,
            spbill_create_ip,
            notify_url,
            trade_type,
            openid
        };
        return wxpay.paysignJSAPI(signData, mchkey);
    };

    //生成paySign字段
    genPaySign(nonceStr, prepayId, timeStamp) {
        //生成paySign 参数
        let appId = WXCONSTANT.WX_APP.qianmen_xcx.appid,
            mchKey = WXCONSTANT.WX_PAY_CONFIG.partner_key;
        let payData = {
            appId: appId,
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: 'prepay_id=' + prepayId,
            signType: 'MD5'
        };
        return wxpay.paysignJSAPI(payData, mchKey);
    }

    //统一下单，返回微信单号
    createNo(bodyData, nonceStr, openId, bizType, outTradeNo, spbillIp, totalFee, sign) {
        let appId = WXCONSTANT.WX_APP.qianmen_xcx.appid,
            mchId = WXCONSTANT.WX_PAY_CONFIG.mch_id,
            notifyUrl = WXCONSTANT.WX_PAY_CONFIG.notify_url + `${bizType}` + '/' + `${outTradeNo}`,
            tradeType = WXCONSTANT.WX_PAY_CONFIG.trade_type;

        let postData = `
                    <xml>
                    <appid><![CDATA[${appId}]]></appid>
                    <body><![CDATA[${bodyData}]]></body>
                    <mch_id><![CDATA[${mchId}]]></mch_id>
                    <nonce_str><![CDATA[${nonceStr}]]></nonce_str>
                    <notify_url><![CDATA[${notifyUrl}]]></notify_url>
                    <openid><![CDATA[${openId}]]></openid>
                    <out_trade_no><![CDATA[${outTradeNo}]]></out_trade_no>
                    <spbill_create_ip><![CDATA[${spbillIp}]]></spbill_create_ip>
                    <total_fee><![CDATA[${totalFee}]]></total_fee>
                    <trade_type><![CDATA[${tradeType}]]></trade_type>
                    <sign>${sign}</sign>
                    </xml>
                `;

        let agent = new ReqAgent();
        return agent.post(WXCONSTANT.WX_URI.WX_PAY.ORDER, postData)
            .then(xml => {
                return require('xml2js').parseStringPromise(xml)
                    .then(resp => {
                        let result = resp.xml;
                        if (result.return_code[0] === 'FAIL') throw this.error('下单失败: ' + result.return_msg[0], 90012);
                        //微信支付订单号
                        return result.prepay_id[0];
                    })
            })
    }


    //统一下单
    // createPay(touristId, userId, totalFee, bodyData, userData, clientIp) {
    //     return this.getOpenIdByUserId(userId)
    //         .then(openId => {
    //             let appid = WXCONSTANT.WX_APP.qianmen_xcx.appid,
    //                 mch_id = WXCONSTANT.WX_PAY_CONFIG.mch_id,
    //                 body = bodyData,
    //                 out_trade_no = generateTradNo(),
    //                 total_fee = totalFee,
    //                 spbill_create_ip = clientIp || '127.0.0.1',
    //                 notify_url = WXCONSTANT.WX_PAY_CONFIG.notify_url + `${out_trade_no}`,
    //                 trade_type = WXCONSTANT.WX_PAY_CONFIG.trade_type,
    //                 mchkey = WXCONSTANT.WX_PAY_CONFIG.partner_key,
    //                 openid = openId,
    //                 nonce_str = generateNonceString();
    //
    //             //首先生成签名sign
    //             let signData = {
    //                 appid,
    //                 mch_id,
    //                 nonce_str,
    //                 body,
    //                 notify_url,
    //                 out_trade_no,
    //                 spbill_create_ip,
    //                 total_fee,
    //                 trade_type,
    //                 openid
    //             };
    //             let sign = wxpay.paysignJSAPI(signData, mchkey);
    //
    //             let postData = `
    //                 <xml>
    //                 <appid><![CDATA[${appid}]]></appid>
    //                 <body><![CDATA[${body}]]></body>
    //                 <mch_id><![CDATA[${mch_id}]]></mch_id>
    //                 <nonce_str><![CDATA[${nonce_str}]]></nonce_str>
    //                 <notify_url><![CDATA[${notify_url}]]></notify_url>
    //                 <openid><![CDATA[${openid}]]></openid>
    //                 <out_trade_no><![CDATA[${out_trade_no}]]></out_trade_no>
    //                 <spbill_create_ip><![CDATA[${spbill_create_ip}]]></spbill_create_ip>
    //                 <total_fee><![CDATA[${total_fee}]]></total_fee>
    //                 <trade_type><![CDATA[${trade_type}]]></trade_type>
    //                 <sign>${sign}</sign>
    //                 </xml>
    //             `;
    //
    //             let agent = new ReqAgent();
    //             return agent.post(WXCONSTANT.WX_URI.WX_PAY.ORDER, postData)
    //                 .then(xml => {
    //                     return require('xml2js').parseStringPromise(xml)
    //                         .then(resp => {
    //                             let result = resp.xml;
    //                             if (result.result_code[0] === 'FAIL') throw this.error('下单失败: ' + result.err_code_des[0], 90012);
    //                             //正常返回下单成功 存库
    //                             let td = new TouristOrder();
    //                             let data = {
    //                                 touristId: touristId,
    //                                 userId: userId,
    //                                 tradeNo: out_trade_no,		// 商户订单号
    //                                 totalFee: totalFee,        // 订单支付金额
    //                                 wxTradeType: trade_type,	//交易类型
    //                                 wxTransactionId: result.prepay_id[0],//微信支付订单号
    //                                 attach: userData
    //                             };
    //
    //                             //生成paySign 参数
    //                             let payData = {
    //                                 appId: appid,
    //                                 timeStamp: Date.now() + '',
    //                                 nonceStr: nonce_str,
    //                                 package: 'prepay_id=' + result.prepay_id[0],
    //                                 signType: 'MD5'
    //                             };
    //                             let paySign = wxpay.paysignJSAPI(payData, mchkey);
    //                             return td.createOrder(data).then(() => {
    //                                 return {
    //                                     appId: appid,
    //                                     timeStamp: payData.timeStamp,
    //                                     nonceStr: nonce_str,
    //                                     package: 'prepay_id=' + result.prepay_id[0],
    //                                     signType: 'MD5',
    //                                     paySign: paySign
    //                                 };
    //                             })
    //                         })
    //                 })
    //         })
    // }

    //得到微信订单号生成商户订单存库
    createPay(bizType, bizId, userId, totalFee, bodyData, userData, clientIp) {
        let tradeType = WXCONSTANT.WX_PAY_CONFIG.trade_type;
        let appId = WXCONSTANT.WX_APP.qianmen_xcx.appid;

        let nonceStr = generateNonceString();
        let tradeNo;
        let data = {
            userId: userId,              //支付用户
            totalFee: totalFee,         // 订单支付金额
            wxTradeType: tradeType,      //交易类型
            attach: userData
        };

        let bizOrder = null;
        if (bizType === WXCONSTANT.WX_PAY_BIZ.tourist) {
            tradeNo = generateTradNo();
            data.touristId = bizId;
            bizOrder = new TouristOrder();
        } else if (bizType === WXCONSTANT.WX_PAY_BIZ.topic_train) {
            tradeNo = generateTrainTradNO();
            data.topicId = bizId;
            bizOrder = new TopicOrder();
        }

        return this.getOpenIdByUserId(userId).then(openId => {
            let sign = this.gensignature(bizType, openId, nonceStr, bodyData, totalFee, clientIp, tradeNo);
            return this.createNo(bodyData, nonceStr, openId, bizType, tradeNo, clientIp, totalFee, sign).then(prepayId => {
                let timeStamp = Date.now() + '';
                let paySign = this.genPaySign(nonceStr, prepayId, timeStamp);
                data.tradeNo = tradeNo;
                data.wxTransactionId = prepayId;//微信支付订单号
                return bizOrder.createOrder(data).then(() => {
                    return {
                        appId: appId,
                        timeStamp: timeStamp,
                        nonceStr: nonceStr,
                        package: 'prepay_id=' + prepayId,
                        signType: 'MD5',
                        paySign: paySign
                    }
                })
            })
        })
    }


}


module.exports = WxPay;
