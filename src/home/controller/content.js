'use strict';

import Base from './base.js';
import turnpage from "../../common/tools/turnpage.js";

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
            let article = this.model("article");
            let tree = this.model("tree");
            let requests = [];
            let param = xss(this.get());
            let art; //文章
            if (param.preview && this.cookie("username")) { //模版预览
                art = await article.getPreview(getInt(param.id)); //执行预览
            } else {
                art = await article.get(getInt(param.id));
            }

            if (!art.msg.nodeid) {
                return this.json({
                    state: false,
                    msg: "文章不存在"
                });
            }
            let conTurnPage = this.tpage(param.cp, art.msg.content, "/content/" + param.id);
            art.msg.content = conTurnPage.content;
            requests.push(tree.pageSister(art.msg.nodeid)); //子节点
            requests.push(tree.crumbs(art.msg.nodeid)); //面包屑
            let result = await Promise.all(requests);
            this.assign({
                news: art.msg,
                nodelist: result[0].msg,
                crumbs: result[1].msg,
                tp: conTurnPage.tp
            });
            return this.display();
        }
        /**
         * index action
         * @return {Promise} []
         */
    async photoAction() {
            let article = this.model("article");
            let tree = this.model("tree");
            let requests = [];
            let param = xss(this.get());
            let art; //文章
            if (param.preview && this.cookie("username")) { //模版预览
                art = await article.getPreview(getInt(param.id)); //执行预览
            } else {
                art = await article.get(getInt(param.id));
            }

            if (!art.msg.nodeid) {
                return this.json({
                    state: false,
                    msg: "文章不存在"
                });
            }
            let conTurnPage = this.tpage(param.cp, art.msg.content, "/content_photo/" + param.id);
            art.msg.content = conTurnPage.content;

            requests.push(tree.pageSister(art.msg.nodeid)); //子节点
            requests.push(tree.crumbs(art.msg.nodeid)); //面包屑
            let result = await Promise.all(requests);
            this.assign({
                news: art.msg,
                nodelist: result[0].msg,
                crumbs: result[1].msg,
                tp: conTurnPage.tp
            });
            return this.display();
        }
        /**
         * index action
         * @return {Promise} []
         */
    async videoAction() {
            let article = this.model("article");
            let tree = this.model("tree");
            let requests = [];
            let param = xss(this.get());
            let art; //文章
            if (param.preview && this.cookie("username")) { //模版预览
                art = await article.getPreview(getInt(param.id)); //执行预览
            } else {
                art = await article.get(getInt(param.id));
            }

            if (!art.msg.nodeid) {
                return this.json({
                    state: false,
                    msg: "文章不存在"
                });
            }

            let conTurnPage = this.tpage(param.cp, art.msg.content, "/content_video/" + param.id);
            art.msg.content = conTurnPage.content;

            requests.push(tree.pageSister(art.msg.nodeid)); //子节点
            requests.push(tree.crumbs(art.msg.nodeid)); //面包屑
            let result = await Promise.all(requests);
            this.assign({
                news: art.msg,
                nodelist: result[0].msg,
                crumbs: result[1].msg,
                tp: conTurnPage.tp
            });
            return this.display();
        }
        /**
         * 文章内分页算法
         * @param  {[type]} cp      [description]
         * @param  {[type]} content [description]
         * @param  {[type]} path    [description]
         * @return {[type]}         [description]
         */
    tpage(cp, content, path) {
            cp = cp ? parseInt(cp) : 1;
            let returnJson = {};
            let conts = content.split('<hr style="page-break-after:always;" class="ke-pagebreak" />');
            let count = conts.length;
            if (cp > count) {
                cp = count;
            }
            let tp;
            if (count == 1) {
                tp = '';
            } else {
                tp = new turnpage({
                    name: path + "_" + "{cp}",
                    sum: count,
                    mp: 1
                });
                returnJson.tp = tp.hunde(cp).replace(path+"_1", path).replace(path+"_1", path);
            }
            returnJson.content = this.closeHTML(conts[cp - 1]);
            return returnJson;
        }
        /**
         * 闭合html标签
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
    closeHTML(str) {
        var arrTags = ["span", "font", "b", "u", "i", "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "ul", "table", "div"];
        for (var i = 0; i < arrTags.length; i++) {
            var intOpen = 0;
            var intClose = 0;
            var re = new RegExp("<" + arrTags[i] + "( [^<>]+|)>", "ig");
            var arrMatch = str.match(re);
            if (arrMatch != null) intOpen = arrMatch.length;
            re = new RegExp("</" + arrTags[i] + ">", "ig");
            arrMatch = str.match(re);
            if (arrMatch != null) intClose = arrMatch.length;
            for (var j = 0; j < intOpen - intClose; j++) {
                str += "</" + arrTags[i] + ">"
            }
        }
        return str
    }

}
