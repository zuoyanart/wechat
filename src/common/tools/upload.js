'use strict';

import fs from 'fs';
import objectid from 'objectid';
import gm from "gm";
import qiniu from "qiniu";
/**
 * 上传相关操作
 */
export default class {
    /**
     * 本地上传方法
     * @method local
     * @param  {[type]} file   上传的file对象
     *file: { fieldName: 'imgFile',
       originalFilename: '152917.62810508_900.jpg',
       path: '/data/host/thinkjs/runtime/upload/XQpGvfJrQoXjYQ_WfoST_vCP.jpg',
       headers:
        { 'content-disposition': 'form-data; name="imgFile"; filename="152917.62810508_900.jpg"',
          'content-type': 'image/jpeg' },
          size: 101700 }
        }
     * @return {[type]}           [description]
     */
    static async localImg(file, options) {
            let fileConfig = { //允许
                exten: ';jpg;jpeg;png;bmp;gif;', //扩展名
                maxSize: 5242880, //文件最大大小，单位B
                static: think.RESOURCE_PATH, //图片保存目录
                toPath: '/upload/' + think.datetime(new Date, "YYYY/MM/DD") //生成的文件路径：/upload/2016/02/01
            };

            let finalFileName = ''; //最终的文件名称
            let fileExt = file.path.split('.')[1].toLowerCase();
            if (fileConfig.exten.indexOf(';' + fileExt + ';') == -1 || file.headers.size > fileConfig.maxSize) { //判断限制条件
                return finalFileName;
            }

            //处理后缀和文件名
            finalFileName = '/' + objectid() + '.' + fileExt;
            think.mkdir(fileConfig.static + fileConfig.toPath);

            fs.renameSync(file.path, fileConfig.static + fileConfig.toPath + finalFileName);
            if (think.isFile(fileConfig.static + fileConfig.toPath + finalFileName)) { //移动成功
                if (options && options.width) { //生成缩略图
                    think.mkdir((fileConfig.static + fileConfig.toPath).replace("/upload/", "/upload/thum/"));
                    let width = options.width || 100;
                    let height = options.height || 100;
                    let gmk = gm.subClass({
                        imageMagick: true
                    });
                    gmk(fileConfig.static + fileConfig.toPath + finalFileName)
                        .resize(width, height)
                        .noProfile()
                        .write(Article.getThum(fileConfig.static + fileConfig.toPath + finalFileName, width, height), function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                }
                return fileConfig.toPath + finalFileName;
            }
            return "";
        }
        /**
         * 云上传
         * @param  {[type]} file    [description]
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
    static async cloudImg(file, options) {
        let fileConfig = { //允许
            exten: ';jpg;jpeg;png;bmp;', //扩展名
            maxSize: 5242880, //文件最大大小，单位B
            static: think.RESOURCE_PATH, //图片保存目录
            toPath: '/upload/' + think.datetime(new Date, "YYYY/MM/DD") //生成的文件路径：/upload/2016/02/01
        };

        let finalFileName = ''; //最终的文件名称
        let fileExt = file.path.split('.')[1];
        if (fileConfig.exten.indexOf(';' + fileExt + ';') == -1 || file.headers.size > fileConfig.maxSize) { //判断限制条件
            return finalFileName;
        }

        //处理后缀和文件名
        finalFileName = '/' + objectid() + '.' + fileExt;
        think.mkdir(fileConfig.static + fileConfig.toPath);

        fs.renameSync(file.path, fileConfig.static + fileConfig.toPath + finalFileName);
        if (think.isFile(fileConfig.static + fileConfig.toPath + finalFileName)) { //移动成功
            if (options) { //上传到七牛云
                qiniu.conf.ACCESS_KEY = options.key;
                qiniu.conf.SECRET_KEY = options.secret;
                let key =  (fileConfig.toPath + finalFileName).replace("/upload/", "upload/")
                function uptoken(bucket, key) {
                    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
                    return putPolicy.token();
                }
                let token = uptoken(options.bucket, key); //生成token
                function uploadFile(uptoken, key, localFile) {
                    return new Promise(function(resolve, reject) {
                        var extra = new qiniu.io.PutExtra();
                        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
                            if (!err) {
                                // 上传成功， 处理返回值
                                console.log(ret.hash, ret.key, ret.persistentId);
                                resolve({
                                    "state": true,
                                    "msg": ret
                                });
                            } else {
                                // 上传失败， 处理返回代码
                                console.log(err);
                                reject({
                                    "state": false,
                                    "msg": err
                                });
                            }
                        });
                    });
                }

                //调用uploadFile上传
                let result = await uploadFile(token, key, fileConfig.static + fileConfig.toPath + finalFileName);
                console.log(result);
                if (result.state == true) {
                    return fileConfig.toPath + finalFileName;
                }
                return "";
            }
            return "";
        }
        return "";
    }
}
