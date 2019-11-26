export const newCookieUtil = function () {
    var cookies = function () {
        return {
            set: function (key, value) {
                var cookieStr = "";
                cookieStr = key + "=" + value;
                document.cookie = cookieStr;
            },
            getCookie: function (key) {
                var cookieStr = document.cookie;
                return cookieStr;
            },
            removeItem: function (key) {
                var exp = new Date();
                var cval = getCookie(key);
                if (cval != null)
                    document.cookie = key + "='';expires=" + exp.toGMTString();
            },
        };
    }();
    var localStroages = function () {
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
    var sessionStorages = function () {
        return {
            set: function (key, value) {
                window.sessionStorage.setItem(key, value);
            },
            get: function (key) {
                return window.sessionStorage.getItem(key);
            },
            removeItem: function (key) {
                window.sessionStorage.removeItem(key);
            },
        }; //end of return;
    }();
    return (function () {
        var c = cookies;
        var l = localStroages;
        var s = sessionStorages;
        return {
            isLocalStorage: window.localStorage ? true : false,
            get: function (key) {
                if (!this.isLocalStorage) {
                    return c.getCookie(key);
                } else {
                    return l.get(key);
                }
            },
            getSession: function (key) {
                return s.get(key);
            },
            add: function (key, value) {
                if (!this.isLocalStorage) {
                    c.set(key, value);
                } else {
                    l.set(key, value);
                }
            },
            addSession: function (key, value) {
                s.set(key, value);
            },
            remove: function (key) {
                if (!this.isLocalStorage) {
                    c.removeItem(key);
                } else {
                    l.removeItem(key);
                }
            },
            removeSession: function (key) {
                s.removeItem(key);
            }
        };
    })();
}();

var client = function () {
    var engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        ver: null
    };

    var browser = {
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        ver: null
    };

    var system = {
        win: false,
        mac: false,
        xll: false,
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        wii: false,
        ps: false
    }
    var current = {
        engine: '',
        browser: '',
        system: ''
    }

    var ua = window.navigator.userAgent,
        p = window.navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.xll = (p.indexOf('Linux') == 0 || p.indexOf('Xll') == 0);

    system.iphone = ua.indexOf('iPhone') > -1;
    system.ipod = ua.indexOf('iPod') > -1;
    system.ipad = ua.indexOf('iPad') > -1;

    // ios
    if (system.mac && ua.indexOf('Mobile') > -1) {
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace('_', '.'));
        } else {
            system.ios = 2;
        }
    }
    // android
    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }
    // nokia
    system.nokiaN = ua.indexOf('NokiaN') > -1;

    // windows mobile
    if (system.win == 'CE') {
        system.winMobile = system.win;
    } else if (system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = 'Phone';
            system.winMobile = parseFloat(RegExp['$1']);
        }
    }

    // game system
    system.wii = ua.indexOf('Wii') > -1;
    system.ps = /playstation/i.test(ua);

    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/i.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.webkit = parseFloat(engine.ver);

        // 确定是chrome 还是 safari
        if (/Chrome\/(\S+)/i.test(ua)) {
            browser.chrome = parseFloat(engine.ver);
        } else if (/Version\/(\S+)/i.test(ua)) {
            browser.safari = parseFloat(engine.ver);
        } else {
            // 近似的确认版本号，早期版本的safari版本中userAgent没有Version
            var safariVersion = 1;

            if (engine.webkit < 100) {
                safariVersion = 1;
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }

            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/i.test(ua) || /Konqueror\/([^;]+)/i.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/i.test(ua)) {
        engine.ver = RegExp['$1'];
        engine.gecko = parseFloat(engine.ver);

        // 确定是不是Firefox浏览器
        if (/Firefox\/(\S+)/i.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/i.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp['$1'] == 'NT') {
                switch (RegExp['$2']) {
                    case '5.0':
                        system.win = '2000';
                        break;
                    case '5.1':
                        system.win = 'XP';
                        break;
                    case '6.0':
                        system.win = 'Vista';
                        break;
                    case '6.1':
                        system.win = '7';
                        break;
                    case '6.2':
                        system.win = '8';
                        break;
                    default:
                        system.win = 'NT';
                        break;
                }
            } else if (RegExp['$1'] == '9x') {
                // 检测windows ME
                system.win = 'ME';
            } else {
                // 检测windows 95、windows 98
                system.win = RegExp['$1'];
            }
        }
    }
    for (var s in engine) {
        current.engine = current.engine + (engine[s] ? s : '');
    }
    for (var s in browser) {
        current.browser = current.browser + (browser[s] ? s : '');
    }
    for (var s in system) {
        current.system = current.system + (system[s] ? s : '');
    }
    current.engine = current.engine + engine['ver'];
    current.browser = current.browser + browser['ver'];
    return {
        currentengine: current.engine,
        currentbrowser: current.browser,
        currentsystem: current.system
    }
}();

export const cookieTag = {
    usertoken: 'token',
    merchantId: 'mcid',
}
var deviceData = {
    deviceID: 'hc-manage-' + client.currentengine + '-' + client.currentbrowser + '-' + client.currentsystem + (navigator.userAgent.indexOf('Android') > -1 ? 'Android' : (navigator.userAgent.indexOf('iPhone') > -1 ? 'IOS' : 'Others')),
    deviceType: 'hc-manage'
}


//q版本的this.setState
function setStateQ(obj, that) {
    var defer = Q.defer();
    that.setState(obj, defer.makeNodeResolver());
    return defer.promise;
}

//是否为ios
function isIos() {
    var u = window.navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
}

//错误处理
var errorMgr = (function () {
    var code = {
        NoTokenCode: {
            code: 4000,
            responseText: '没有token'
        },
        NoMcidCode: {
            code: 4001,
            responseText: '没有商户'
        },
        UnknowError: {
            code: 4002,
            responseText: '未知错误'
        }
    }

    function ThrowError() {
    }

    ThrowError.prototype.setError = function (key) {
        var _code = code[key] || code.UnknowError;
        var _error = new Error();
        _error.code = _code.code;
        _error.responseText = _code.responseText;
        return _error;
    };
    ThrowError.prototype.getErrorCode = function (key) {
        var _code = code[key] || code.UnknowError;
        return _code.code;
    };

    var _throwError = new ThrowError();
    return {
        throwError: function (key) {
            throw _throwError.setError(key);
        },
        getcode: function (key) {
            return _throwError.getErrorCode(key);
        }
    };
})();
var errorCode = {
    NoTokenCode: 'NoTokenCode',
    NoMcidCode: 'NoMcidCode',
    UnknowError: 'UnknowError',
}

function raiseError(key) {
    errorMgr.throwError(errorCode[key]);
}

var config = {
    car_change_plan_type: {
        one_way_sell: "one_way_sell",
        one_way_buy: "one_way_buy",
        common: "common"
    },
    order_deal_type: {
        full_delegate: "full_delegate", // 全委托
        semi_delegate: "semi_delegate", // 半委托
        no_delegate: "no_delegate" // 不委托
    },
    plan_levels: ['1_H', '2_A', '3_B', '4_C', '5_C', '6_L', '7_X'],//订单优先级（由高到低为H-A）
    call_center_user_level: {
        "1_H": "H",
        "2_A": "A",
        "3_B": "B",
        "4_C": "C",
        "5_C": "C-",
        "6_L": "L",
        "7_X": "X",
    },
    plan_level_color: {
        '1_H': 'red',
        '2_A': 'green',
        '3_B': '#91d14f',
        '4_C': '#02b0f0',
        '5_C': '#ffc107',
        '6_L': 'gray',
        '7_X': '#795548'
    } //订单优先级对应颜色
}