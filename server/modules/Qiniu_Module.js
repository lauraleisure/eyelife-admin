const config = require('../config');
const Rst = require('./Rst_Module');
const Q = require('q');
const qiniu = require('qiniu');
const tools = require('../utils/tools');
const formidable = require('formidable');
const urlUtil = require("url");
const path = require("path");
const request = require("request");
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');


qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;


class QiniuUpload extends Rst {

    static uploadByBase64(data) {
        if (!data.imgData) throw this.error('缺少图片数据', 90012);
        let imgData = data.imgData;
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        return this.uploadByBuffer(dataBuffer, {prefix: data.prefix, bucket: data.bucket});
    }

    static getPutToken(bucket, key) {
        let str;
        if (key) {
            str = bucket + ':' + key;
        } else {
            str = bucket;
        }
        let options = {
            scope: str,
            callbackUrl: config.ApiServerAddress + '/api/qiniu/upload/callback',
            callbackBody: 'filename=$(fname)&filesize=$(fsize)&bucket=$(bucket)&key=$(key)&imageInfo=$(imageInfo)'
        }
        let pp = new qiniu.rs.PutPolicy(options);
        let mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KEY);

        return pp.uploadToken(mac);
    }

    static getUploader() {
        const q_config = new qiniu.conf.Config();
        q_config.zone = qiniu.zone.Zone_z0;
        let formUploader = new qiniu.form_up.FormUploader(q_config);
        return formUploader;
    }

    //通过二进制数据上传图片;fields.prefix=前缀  fields.bucket=要上传到的bucket
    static uploadByBuffer(fileBuffer, fields) {
        const def = Q.defer();
        let prefix = fields.prefix;
        let bucket = fields.bucket;
        let thumbnail = fields.thumbnail;

        let resId = tools.genResId();
        if (prefix) {
            resId = prefix + "/" + tools.genResId();
        }

        let formUploader = this.getUploader();
        formUploader.put(
            this.getPutToken(bucket, resId),
            resId,
            fileBuffer,
            new qiniu.form_up.PutExtra(),
            function (err, ret) {
                if (err) {
                    def.reject(err);
                } else {
                    if (ret.bucket == 'imgpub') {
                        ret.url = config.ImageHost.imagePub + "/" + ret.key + "-normal";
                        if (thumbnail) {
                            ret.thumbnail = tools.genCdnImageUrl(config.ImageHost.imagePub, ret.key + "?imageMogr2/thumbnail/" + thumbnail);
                        }
                    } else {
                        ret.url = config.ImageHost.imagePub + '/' + ret.key;
                    }
                    def.resolve(ret);
                }
            });
        return def.promise;
    }

    //通过表单上传;formFileName=表单文件name
    static uploadByForm(req, filename) {
        let _this = this;
        var def = Q.defer();
        var bucket = req.query.bucket;
        var prefix = req.query.prefix;
        var thumbnail = req.query.thumbnail;
        if (!filename) filename = tools.genResId();

        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            if (err) {
                def.reject(err);
            } else {
                if (bucket) {
                    fields.bucket = bucket;
                }
                if (prefix) {
                    fields.prefix = prefix;
                }
                if (thumbnail) {
                    fields.thumbnail = thumbnail;
                }
                var result = [];
                result.push(fields);
                result.push(files);
                def.resolve(result);
            }
        });

        return def.promise.then(function (ret) {
            if (ret[0] && ret[1]) {
                var tpField = ret[0];
                var tpPath = ret[1].file.path;
                return _this.uploadByPath(tpPath, tpField);
            } else {
                return;
            }
        });
    }

    static uploadByPath(filePath, fields) {
        let _this = this;
        var def = Q.defer();
        var prefix = fields.prefix;
        var bucket = fields.bucket;
        var thumbnail = fields.thumbnail;

        var resId = tools.genResId();
        if (prefix) {
            resId = prefix + "/" + tools.genResId();
        }

        var formUploader = this.getUploader();
        formUploader.putFile(
            _this.getPutToken(bucket, resId),
            resId,
            filePath,
            new qiniu.form_up.PutExtra(),
            function (err, ret) {
                if (err) {
                    def.reject(err);
                } else {
                    if (ret.bucket == 'imgpub') {
                        ret.url = config.ImageHost.imagePub + "/" + ret.key + "-normal";
                        if (thumbnail) {
                            ret.thumbnail = tools.genCdnImageUrl(config.ImageHost.imagePub, ret.key + "?imageMogr2/thumbnail/" + thumbnail);
                        }
                    } else {
                        ret.url = config.ImageHost.imagePub + '/' + ret.key;
                    }
                    def.resolve(ret);
                }
            });
        return def.promise;
    }

    //
    // static downloadImgFromQiniuAndSaveToMongo(url, content, callback) {
    //     let _this = this;
    //     if (url && content) {
    //         var imgUrl = urlUtil.parse(url);
    //         var tpkey = imgUrl.path;
    //         var tpHost = imgUrl.host;
    //         var filePath = path.join('/tmp', tpkey);
    //         var tptoken = _this.getGetToken(url);
    //        this.downloadImage(tptoken, filePath, function (err, data) {
    //             if (err) {
    //                 console.error(err);
    //                 callback(err);
    //             } else {
    //                 _this.saveFileToMongo(filePath, content, callback);
    //             }
    //         });
    //     } else {
    //         callback();
    //     }
    // }
    //
    //
    // static saveFileToMongo(filePath, dt, cb) {
    //     var option = {};
    //
    //     if (dt.filename) option.filename = dt.key;
    //     if (dt.content_type) option.content_type = dt.content_type;
    //     if (dt.bucket) option.root = dt.bucket;
    //
    //     if (option.filename) {
    //         var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    //
    //         gfs.exist(option, function (err, found) {
    //             if (err) return cb(err);
    //             if (found) {
    //                 if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    //                 cb(null, dt);
    //             } else {
    //                 var ws = gfs.createWriteStream({
    //                     _id: mongoose.Types.ObjectId(),
    //                     filename: option.filename,
    //                     root: option.root,
    //                     metadata: dt
    //                 });
    //                 ws.on('close', function (file) {
    //                     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    //                     // fs.unlinkSync(filePath);
    //                     cb(null, dt);
    //                 });
    //                 ws.on('error', function (err) {
    //                     console.log(err);
    //                 })
    //                 fs.createReadStream(filePath).pipe(ws);
    //             }
    //         })
    //     } else {
    //         cb();
    //     }
    // }

    static downloadImage(uri, filename, callback) {
        var dir = filename.substring(0, filename.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
            var mkdirp = require('mkdirp');
            mkdirp.sync(dir);
        }
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    }


    static getGetToken(url, key) {
        var bucketManager = this.getManager();
        var deadline = parseInt(Date.now() / 1000) + 3600; // 1小时过期
        return bucketManager.privateDownloadUrl(url, key || '', deadline);
    }


    static getManager() {
        var mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KEY);
        var q_config = new qiniu.conf.Config();
        //config.useHttpsDomain = true;
        q_config.zone = qiniu.zone.Zone_z0;
        var bucketManager = new qiniu.rs.BucketManager(mac, q_config);

        return bucketManager;
    }
}


module.exports = QiniuUpload;

