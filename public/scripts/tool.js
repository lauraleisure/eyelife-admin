var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

//验证手机号码
var cellPhoneRegExp = function (val) {
    var reg = /^(1[3-9]{1})+\d{9}$/;
    return reg.test(val);
};

//随机验证码操作--4位纯数字
var verificationCodeRegExp = function(val) {
    var reg = /^\d{4}$/;
    return reg.test(val);
};
//短信验证码---6位纯数字
var cellPhoneCodeRegExp = function(val) {
    var reg = /^\d{6}$/;
    return reg.test(val);
};
//密码--4~16为数字+字母
var passwdRegExp = function(val) {
    var regl = /^[0-9a-z]{4,16}$/i;
    var reg = /^[0-9a-z]+([0-9]{1}[a-z]{1}||[a-z]{1}[0-9]{1})[0-9a-z]+$/i;
    return reg.test(val) && regl.test(val);
};
var moneyRegExp=function(val) {
    var reg=/^\d+(\.\d{1,2})?$/;
    return reg.test(val);

};
/*身份证长度或格式验证*/
var cardIDRegExp=function(cardId){
    var  reg= /^\d{17}(\d|x)$/i;
    var  reg1= /^\d{14}(\d|x)$/i;
    return (reg.test(cardId)||reg1.test(cardId));
};
//q版本的this.setState
function setStateQ(obj, that) {
    var defer = Q.defer();
    that.setState(obj, defer.makeNodeResolver());
    return defer.promise;
}

function ajaxUtil_notoken(url, type, data) {
    var params = {
        url: url,
        type: type,
        data: data ? JSON.stringify(data) : null,
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", 'application/json');
        }
    };
    var defer = Q.defer();
    params.success = function (d) {
        if (d.error || d.statusCode < 0) {
            defer.reject(d);
        } else {
            defer.resolve(d);
        }
    };
    params.error = function (d) {
        defer.reject(d);
    };
    $.ajax(params);
    return defer.promise;
}
var tool_timer;
//倒计时
function leftTimer(year, month, day, hour, minute, second,reloadUrl) {
    // debugger
    var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); //计算剩余的毫秒数
    if (leftTime > 0) {
        var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10) || '0'; //计算剩余的天数
        var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10) || '0'; //计算剩余的小时
        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10) || '0';//计算剩余的分钟
        var seconds = parseInt(leftTime / 1000 % 60, 10) || '0';//计算剩余的秒数
        days = checkTime(days);
        hours = checkTime(hours);
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        $("#day").text(days);
        $("#hour").text(hours);
        $("#minute").text(minutes);
        $("#seconds").text(seconds);
        tool_timer=setTimeout(function () {
            leftTimer(year, month ,day ,hour ,minute ,second );
        }, 1000);
    } else {
        clearTimeout(tool_timer);
        $("#day").text("00");
        $("#hour").text("00");
        $("#minute").text("00");
        $("#seconds").text("00");
        reloadPage(0.01,reloadUrl);
    }
}
// leftTimer(2018, 11, 18, 23, 59, 59);
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
//格式化时间到秒
function formatDateBySecond(d) {
    if(d)
    {
        return moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY/MM/DD HH:mm:ss');
    }
    else {
        return moment().format('YYYY/MM/DD HH:mm:ss');
    }

}
//格式化时间到日
function formatDateByDay(d) {
    if(d)
    {
        return moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY年MM月DD日');
    }
    else {
        // return moment().format('YYYY年MM月DD日');
    }

}
function leftTime(expiredTime){
    var expiredTime=expiredTime?expiredTime:new Date();
    var leftTime=formatDateBySecond(expiredTime).replace(/\//g,',').replace(' ',',').replace(/:/g,',');
    var timeArr=leftTime.split(',');
    leftTimer(parseInt(timeArr[0]),parseInt(timeArr[1]),parseInt(timeArr[2]),parseInt(timeArr[3]),parseInt(timeArr[4]),parseInt(timeArr[5]));
}
//页面刷新
var reloadPage = function(time, url) {
    setTimeout(function() {
        window.location.href = url ? url : window.location.href;
    }, time * 1000);
};
/*错误信息统一处理*/
function callbackAlertError(e) {
    if (e && e.statusText == 'Unauthorized') {
        // window.location.href = '/login';
    } else if (e && e.responseText == '{"statusCode":403008,"message":"账户未授权"}') {
        // window.location.href = '/unauthorized';
    } else if (e && e.code == 'frontError') {
        showMessage(e.message);
    } else {
        var message = '系统错误，请稍后重试';
        if(e && typeof(e.responseText)==='undefined'){
            e.responseText=JSON.stringify(e);
        }
        if (e) {
            try {
                var json = JSON.parse(e.responseText);
                message = json.message;
            } catch (e) {}
        }
        showMessage(message);
    }

}
function showMessage(msg, time) {
    var t = time ? time : 3;
    doingMessage(msg);
    setTimeout(function() {
        removeDoingMessage();
    }, t * 1000);
}
function doingMessage(msg) {
    $("#fixed").append("<div class='translateFixedDiv' id='showFixedDiv'><div class='showFixedMessage'>" + msg + "</div></div>");
}

function removeDoingMessage() {
    $('#fixed').html('');
}

/*判断是否是微信端*/
var is_weixin = function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
};
/*判断是否是PC端*/
var is_pc = function() {
    var reg = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/;
    var agent = window.navigator.userAgent.toLowerCase();
    if (agent.match(reg)) {
        return false;
    } else {
        return true;
    }
};