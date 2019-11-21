const config = require('../config');
const models = require('../models')(config);
const Q = require('q');
const _ = require('lodash');
const Rst = require('./Rst_Module');
var moment = require('moment');
const escapeStringRegexp = require('escape-string-regexp');



class Base_Module extends Rst {
    constructor(props) {
        super(props);
        this.models = models;
    }

    prepareModel(model) {
        if (!this.testModel()) this.applyModel(model);
        return this;
    };

    testModel() {
        return this.hasOwnProperty("_model");
    };

    applyModel(model) {
        if (this.models && this.models.hasOwnProperty(model)) {
            this._model = this.___model = this.models[model];
            return this;
        }
        throw 'cannot find specific model ' + model;
    };

    find(criterion, fields, sort) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        let _criterion = criterion || {};
        if (!sort) {
            this._model.find(criterion, _fields, deferred.makeNodeResolver());
        } else {
            this._model.find(criterion, _fields).sort(sort).exec(deferred.makeNodeResolver());
        }
        return deferred.promise;
    };


    leanFind(criterion, fields, sort) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        let _criterion = criterion || {};
        if (!sort) {
            this._model.find(criterion, _fields).lean().exec(deferred.makeNodeResolver());
        } else {
            this._model.find(criterion, _fields).sort(sort).lean().exec(deferred.makeNodeResolver());
        }
        return deferred.promise;
    };


    limitFind(criterion, fields, sort, skip, limit) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        let _sort = sort ? sort : {
            nosort: 1
        };
        let _skip = skip ? Number(skip) : 0;
        let _limit = limit ? Number(limit) : 0;
        this._model.find(criterion, _fields).sort(_sort).skip(_skip).limit(_limit).exec(deferred.makeNodeResolver());
        return deferred.promise;
    };

    count(criterion) {
        let deferred = Q.defer();
        this._model.estimatedDocumentCount(criterion, deferred.makeNodeResolver());
        return deferred.promise;
    };


    findOne(criterion, fields) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        this._model.findOne(criterion, _fields, deferred.makeNodeResolver());
        return deferred.promise;
    };

    findOneAndUpdate(condition, updateData) {
        var deferred = Q.defer();
        this._model.findOneAndUpdate(condition, updateData, deferred.makeNodeResolver());
        return deferred.promise;
    };

    findBy(id, fields) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        this._model.findById(id, _fields, deferred.makeNodeResolver());
        return deferred.promise;
    };


    populateOne(criterion, populateField, fields) {
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        this._model.findOne(criterion, _fields).populate(populateField).exec(deferred.makeNodeResolver());
        return deferred.promise;
    };

    populates(criterion, fields, popFields, sort, skip, limit) {
        /*popFields的格式
            [
                ['keyField','popField1 popField2 popField3']
            ]
        */
        let deferred = Q.defer();
        let _fields = _.extend({}, fields);
        let _pops = popFields ? popFields : [];
        let _sort = _.extend({}, sort);
        let _skip = skip ? skip : 0;
        let _limit = limit ? limit : 0;
        let _finder = this._model.find(criterion, _fields);
        _pops.forEach(function (pop) {
            if (pop.length === 1) {
                _finder = _finder.populate(pop[0]);
            } else if (pop.length === 2) {
                _finder = _finder.populate(pop[0], pop[1]);
            }
        });
        _finder.sort(_sort).skip(_skip).limit(_limit).exec(deferred.makeNodeResolver());
        return deferred.promise;
    };

    update(criterion, data) {
        let deferred = Q.defer();
        this._model.updateOne(criterion, data, {
            multi: true
        }, deferred.makeNodeResolver());
        return deferred.promise;
    };

    upSert(criterion, data) {
        var deferred = Q.defer();
        this._model.update(criterion, data, {
            upsert: true
        }, deferred.makeNodeResolver());
        return deferred.promise;
    };


    bind(data) {
        if (data && data.toObject) {
            this._obj = this.___obj = data;
        } else if (this._model) {
            this._obj = this.___obj = new this._model();
            this._obj = this.___obj = _.extend(this._obj, data);
        } else {
            throw this.rst.error('unavailable model specified');
        }
        this.___biz = {};
        return this;
    };

    save(data) {
        if (!this._obj) {
            this.bind();
        }
        if (data) {
            _.extend(this._obj, data);
        }
        let deferred = Q.defer();
        this._obj.save(deferred.makeNodeResolver());
        return deferred.promise;
    };

    findOneAndRemove(condition) {
        var deferred = Q.defer();
        this._model.deleteOne(condition, deferred.makeNodeResolver());
        return deferred.promise;
    };

    aggregate(array) {
        var deferred = Q.defer();
        this._model.aggregate(array).exec(deferred.makeNodeResolver());
        return deferred.promise;
    }

    formatPagingParams(pageSize, pageCount, defaultPageSize) {
        try {
            var _limit = pageSize ? parseInt(pageSize) : defaultPageSize;
            var _skip = (pageCount === undefined || _limit === undefined) ? 0 : Math.max(0, (parseInt(pageCount) - 1)) * _limit;
            return {
                limit: _limit,
                skip: _skip
            };
        } catch (err) {
            throw new Rst().error('pageSize或pageCount参数不正确');
        }
    };

    getPeriod(start, end) {
        var _start = moment("20050101 0:00:00 000", "YYYYMMDD HH:mm:ss SSS");
        var _end = moment("21010101 23:59:59 999", "YYYYMMDD HH:mm:ss SSS");

        if (start) {
            _start = (start.isValid && start.isValid()) ? start : moment(start + " 0:00:00 000", "YYYYMMDD HH:mm:ss SSS");
        }
        if (end) {
            _end = (end.isValid && end.isValid()) ? end : moment(end + " 23:59:59 999", "YYYYMMDD HH:mm:ss SSS");
        }
        return {
            start: _start,
            end: _end
        };
    };

    //处理特殊字符
    RegExpString (param) {
        let escapedString = escapeStringRegexp(param);
        let _param = new RegExp(escapedString);
        return _param;
    };

}

module.exports = Base_Module;
