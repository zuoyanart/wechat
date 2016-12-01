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

            console.log(param);

            let nodeid = getInt(param.nodeid, 1);
            let cp = getInt(param.cp, 1);
            let mp = getInt(param.mp, 20);
            let path = param.path;

            requests.push(article.page("", nodeid, cp, mp, {
                turnpage: true
            }));
            requests.push(tree.page(nodeid)); //子节点
            requests.push(tree.crumbs(nodeid)); //面包屑

            let result = await Promise.all(requests);
            let tp = new turnpage({
                name: "/" + path + "_" + nodeid +"c{cp}m{mp}",
                sum: result[0].count,
                mp: mp
            });
            this.assign({
                news: result[0].msg,
                nodelist: result[1].msg,
                crumbs: result[2].msg,
                tp: tp.hunde(cp)
            });

            return this.display();
        }
        /**
         * index action
         * @return {Promise} []
         */
    async imgAction() {
            let path = xss(this.get());
            // let paramArr = path.split('/');

            return this.json({
                state: true,
                msg: path
            });
        }
        /**
         * index action
         * @return {Promise} []
         */
    async nodeAction() {
        let path = xss(this.get());
        // let paramArr = path.split('/');

        return this.json({
            state: true,
            msg: path
        });
    }
}
