const mongoose = require("mongoose");
const CONSTANT = require('../common/constant');
const config = require('../config');

class Result {
    constructor() {
        Error.stackTraceLimit = 60;
        Error.apply(this, arguments);
        this.code = 0;
        this.message = "not initialized";
        // this.isManaged_Flag = true;
    }

    helper(code, msg) {
        this.code = code;
        this.message = msg;
        return this;
    };

    initError(code, errMsg, statusCode) {
        this.helper(code, errMsg);
        this.statusCode = statusCode;
        return this;
    };


    error(errMsg, statusCode) {
        this.initError(200, errMsg, statusCode);
        let error = new Error(this.message);
        error.code = this.code;
        error.statusCode = this.statusCode;
        error.isManaged_Flag = true;
        return error;
    }


    toObj(errFlag) {
        var _target = {};
        _target.code = this.code;
        _target.error = errFlag ? true : (this.code >= 400);
        _target.message = this.message;
        if (this.statusCode) {
            _target.statusCode = this.statusCode;
        }

        if (this.hasOwnProperty("data")) {
            _target.data = this.data;
        }
        return _target;
    };

    success(str, data) {
        this.helper(200, str == undefined ? "操作成功" : str);
        if (data != undefined) {
            this.setData(data);
        }
        this.statusCode = 200000;
        return this;
    };

    msg(str) {
        return this.helper(399, str);
    };

    setData(data) {
        if (data != undefined) {
            this.data = data;
        } else {
            delete this.data;
        }
        return this;
    };


    isValidObjectId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    }

    ObjectId(value) {
        if (value === undefined) {
            return mongoose.Types.ObjectId();
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw this.error('Invalid objectId value for:' + value, 98999);
        }
        return mongoose.Types.ObjectId(value);
    }

    checkLanuage(lan) {
        let _lan = CONSTANT.language_type.default;
        if (lan && CONSTANT.language_type[lan]) {
            _lan = CONSTANT.language_type[lan]
        }
        return _lan;
    }

    checkDayOrNight(theme) {
        let _theme = CONSTANT.day_night.default;
        if (theme && CONSTANT.day_night[theme]) {
            _theme = CONSTANT.day_night[theme]
        }
        return _theme;
    }

    qiniu_url(path, thumbnail) {
        let _thumbnail = '?imageMogr2/thumbnail/' + (thumbnail || '375x');
        let url = config.qiniu.root + path + _thumbnail;
        return url;
    }

    //处理视频url
    qiniu_url_video(path) {
        let url = config.qiniu.root + path;
        return url;
    }


}

module.exports = Result;
