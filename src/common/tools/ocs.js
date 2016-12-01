'use strict';
import crypto from 'crypto';
/**
 * 开放云搜索
 * @method
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
let ocs = (() => {
    let self = {};
    let options = {
        url: "http://opensearch-cn-hangzhou.aliyuncs.com",
        version: "v2",
        keyid: "",
        secret: ""
    };
    /**
     * 根据id获取一条记录
     * @method async
     * @param  {[type]}   index [description]
     * @param  {[type]}   id    [description]
     * @param  {Function} cb    [description]
     * @return {[type]}         [description]
     */
    self.get = async(index, id) => {
            let params = {
                query: "query=id:'"+id+"'",
                "index_name": index,
                "format": "json"
            };
            let p = httpBuildQuery(params, "GET");

            let doc = await httpSpider(options.url + "/search", "get", p);
            return doc;
        }
        /**
         * 阿里云搜索
         * @param index 应用名称
         * @param query 查询子句
         * @param filter 过滤子句
         * @param sort 排序子句
         * @param cp 第几页
         * @param mp 一页多少条
         * @param fetch_fields 返回的字段
         * @param aggregate 分组子句
         * @param distinct  distinct子句
         */
    self.search = async(index, query, filter="", sort="", cp=1, mp=20, fetch_fields="", aggregate="", distinct ="") => {
        let params = {};
        params.index_name = index;
        query = "query=" + query;
        query += '&&config=start:' + (cp - 1) * mp + ',hit:' + mp;
        if (sort != '') {
            query =  query + '&&sort=' + sort;
        }
        if (filter != '') {
            query += '&&filter=' + filter;
        }
        if (aggregate != '') {
            query += '&&aggregate=' + aggregate;
        }
        if (distinct != '') {
            query += '&&distinct' + distinct;
        }
        params.query = query;

        if (fetch_fields != '') {
            params.fetch_fields = fetch_fields;
        }

        let p = httpBuildQuery(params, "GET");
        let docs = await httpSpider(options.url + "/search", "get", p);
        return docs;
    }
    /**
     * 添加,删除，修改数据
     * @method
     * @param  {[type]} index     [description]
     * @param  {[type]} json      [description]
     * @param  {[type]} tablename =             "main" [description]
     * @return {[type]}           [description]
     */
    self.edit = async (index, json, tablename = "main") => {
        let params = {};
        params.action = 'push';
        params.items = JSON.stringify(json);
        params.table_name = tableName;
        let p = httpBuildQuery(params, "POST");
        let results = await httpSpider(options.url + "/index/doc/" + index, "post", p);
        return results;
    }


    /**
     * 生成公共参数
     * @method
     * @return {[type]} [description]
     */
    let publicParam = (params) => {
            params["Version"] = "v2";
            params["AccessKeyId"] = options.keyid;
            params["SignatureMethod"] = "HMAC-SHA1";
            params["Timestamp"] = new Date().toISOString().split(".")[0] + "Z";
            params["SignatureVersion"] = "1.0";
            params["SignatureNonce"] = new Date().getTime() + randomChar(4);
            return params;
        }
        /**
         * 生成签名, Signature
         * @method
         * @return {[type]} [description]
         */
    let makeSign = (httpmethod, queryString) => {
            let base = httpmethod + "&" + urlEncode("/") + "&" + urlEncode(queryString);
            return urlEncode(crypto.createHmac("sha1", options.secret + "&").update(base).digest().toString("base64"));
        }
        /**
         * 对参数进行编码
         * @method
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
    let urlEncode = (key) => {
            key = encodeURI(key);
            key = key.replace(/\!/g, '%21');
            key = key.replace(/\*/g, '%2A');
            key = key.replace(/'/g, '%27');
            key = key.replace(/\(/g, '%28');
            key = key.replace(/\)/g, '%29');
            key = key.replace(/:/g, '%3A');
            key = key.replace(/;/g, '%3B');
            key = key.replace(/@/g, '%40');
            key = key.replace(/\+/g, '%2B');
            key = key.replace(/\$/g, '%24');
            key = key.replace(/,/g, '%2C');
            key = key.replace(/\//g, '%2F');
            key = key.replace(/\?/g, '%3F');
            key = key.replace(/\[/g, '%5B');
            key = key.replace(/\]/g, '%5D');
            key = key.replace(/=/g, '%3D');
            key = key.replace(/&/g, '%26');
            return key;
        }
        /**
         * 构建参数信息
         * @method
         * @param  {[type]} params [description]
         * @param  {[type]} ismode [description]
         * @return {[type]}        [description]
         */
    let httpBuildQuery = (params, httpmethod = "GET") => {
        params = publicParam(params);
        let s = '';
        let array = [];
        for (let key in params) {
            array.push(key);
        }
        array = array.sort(); //对参数进行排序
        let len = array.length;
        for (let i = 0; i < len; i++) {
            if (array[i] == 'items') {
                continue;
            }
            s += array[i] + '=' + urlEncode(params[array[i]]) + '&';
        }
        s = s.substring(0, s.length - 1);
        s = s + "&Signature=" + makeSign(httpmethod.toUpperCase(), s);
        return s;
    }

    return self;
})();

module.exports = ocs;
