import { LanguageKey, LanguageConfig } from "./config";
import newCookieUtil from './cookieUtil'
//ajax 请求封装
export const ajax = function (url, type, data) {
    const deferred = Q.defer();
    let token = newCookieUtil.get('token');
    const params = {
        url: url,
        type: type,
        data: data ? JSON.stringify(data) : null,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
            request.setRequestHeader("Content-Type", 'application/json');
        }
    };
    params.success = function (d) {
        if (d.code != -1) {
            deferred.resolve(d);
        } else {
            var _err = new Error(d.msg || '');
            _err.code = -1;
            _err.data = null;
            deferred.reject(_err);
        }
    };
    params.error = function (e) {
        deferred.reject(e);
    };

    $.ajax(params);

    return deferred.promise;

    // return new Promise((resolve, reject) => {
    //     var token = localStorageUtil.get('token');
    //     var params = {
    //         url: url,
    //         type: type,
    //         data: data ? JSON.stringify(data) : null,
    //         beforeSend: function (request) {
    //             request.setRequestHeader("token", token);
    //             request.setRequestHeader("Content-Type", 'application/json');
    //         }
    //     };
    //     params.success = function (d) {
    //         if (d.code != -1) {
    //             resolve(d);
    //         } else {
    //             reject(d);
    //         }
    //     };
    //     params.error = function (e) {
    //         reject(e);
    //     };
    //     $.ajax(params);
    // });
};


export const ajax_notoken = function (url, type, data) {
    const params = {
        url: url,
        type: type,
        data: data ? JSON.stringify(data) : null,
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", 'application/json');
        }
    };
    const defer = Q.defer();
    params.success = function (d) {
        defer.resolve(d);
    };
    params.error = function (d) {
        defer.reject(d);
    };
    $.ajax(params);
    return defer.promise;
};

//本地缓存
export const localStorageUtil = function () {
    const localStroages = function () {
        return {
            set: function (key, value) {
                window.localStorage.setItem(key, value);
            },
            get: function (key) {
                return window.localStorage.getItem(key);
            },
            removeItem: function (key) {
                window.localStorage.removeItem(key);
            },
        }; //end of return;
    }();
    return (function () {
        const l = localStroages;
        return {
            isLocalStorage: window.localStorage ? true : false,
            get: function (key) {
                return localStroages.get(key);
            },
            add: function (key, value) {
                localStroages.set(key, value);
            },
            remove: function (key) {
                localStroages.removeItem(key);
            }
        };
    })();
}();


//判断是否为小程序环境
export const isMiniProgram = function () {
    return window.__wxjs_environment === 'miniprogram';
};


//获取参数
export const getQueryString = function (name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
};

export const API_CONFIG = {
    PROTOCOL: "http",
    DOMAIN: "39.105.228.47",
    PORT: 8080,
    RECOMMENDED_COURSES: ["2019校纪校规", "西安电子科技大学介绍"],
    PC_PROTOCOL: "http",
    PC_DOMAIN: "xsjy.xidian.edu.cn",
    PC_PORT: 8080,
    PC_HOME: '/front/index',
    INDEX_COURSE: [{
        display: "校纪校规",
        course: "2019校纪校规"
    }, {
        display: "校史校情",
        course: "西安电子科技大学介绍"
    }],
    COURSE_LIST_NOTES: "测试测试 ",
    FEEDBACK_QQ: "",
    BuidUrl: function (urlStr) {
        return this.PROTOCOL + "://" + this.DOMAIN + (this.PORT === 80 ? "" : (":" + this.PORT)) + urlStr;
    },
    BuidPCUrl: function () {
        return this.PC_PROTOCOL + "://" + this.PC_DOMAIN + (this.PC_PORT === 80 ? "" : (":" + this.PC_PORT)) + this.PC_HOME;
    }
};

export const pad = function (num, n = 2) {
    let len = num.toString().length
    while (len < n) {
        num = '0' + num;
        len++
    }
    return num
}

export const calcDistance = function (mile) {
    var ret = '';
    var MILE = LanguageConfig(LanguageKey.MILE);
    var KILOMETER = LanguageConfig(LanguageKey.KILOMETER);
    var mile = Number(mile);
    if (mile < 1000) {
        ret = mile.toFixed(1) + ' ' + MILE
    } else {
        ret = (Math.round(mile / 100) / 10).toFixed(1) + ' ' + KILOMETER
    }
    return ret
}

export const getLanAndTheme = function () {
    var lan = getQueryString("lan");
    var theme = getQueryString("theme");
    var token = getQueryString("token");
    var query = [];
    if (lan) {
        query.push("lan=" + lan);
    }
    if (theme) {
        query.push("theme=" + theme);
    }
    if(token){
        query.push("token=" + token);
    }
    var queryString = "";
    if (query.length > 0) {
        queryString = "?" + query.join("&");
    }
    return queryString;
}


export const showMessage = function(msg, time) {
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
//页面刷新
export const reloadPage = function(url,time) {
    let timer=time?time:0;
    setTimeout(function() {
        window.location.href = url ? url : window.location.href;
    }, timer * 1000);
};
