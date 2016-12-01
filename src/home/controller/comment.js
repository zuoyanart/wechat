'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
            let node = this.model("tree");
            let block = this.model("block");
            let article = this.model("article");
            let requests = [];
            requests.push(article.page("", 23, 1, 4)); //大图轮转
            requests.push(article.page("", 24, 1, 4)); //轮转下推荐
            requests.push(article.page("", 25, 1, 5)); //hot
            requests.push(block.get(51)); // 积分榜
            let results = '';
            try {
                results = await Promise.all(requests);
            } catch (e) {
                console.log(e);
            }
            this.assign({
                //  node: results[0].msg,
                a0: results[0].msg,
                a1: results[1].msg,
                a2: results[2].msg,
                b1: results[3].msg.content,
                //  a6: results[6].msg,
                //  a7: results[7].msg,
                //  a8: results[8].msg,
            });
            return this.display();
        }
        /**
         * 获取到评论列表
         * @method pageAction
         * @return {[type]}   [description]
         */
    async pageAction() {
            let param = xss(this.post());
            let comment = this.model("comment");
            let s = await comment.page(param.id, param.cp, param.mp);
            return this.json(s)
        }
        /**
         * 获取到评论列表
         * @method pageAction
         * @return {[type]}   [description]
         */
    async createAction() {
        let param = xss(this.post());
        param.addtime = getUnixTime();
        param.uid = 1;
        param.username = "游客";
        let comment = this.model("comment");
        let s = await comment.create(param);
        return this.json(s)
    }
}
