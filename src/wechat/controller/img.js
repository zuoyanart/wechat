'use strict';

import Base from './base.js';
export default class extends Base {

    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
            //auto render template file index_index.html
            return this.display();
        }
        /**
         * index action
         * @return {Promise} []
         */
    editAction() {
        //auto render template file index_index.html
        return this.display();
    }

    async pageAction() {
        let param = xss(this.post());
        let keywords = await this.model("keywords").page(param.kw, 1, param.cp, param.mp);
        return this.json(keywords)
    }

    async createAction() {
        let param = this.post();
        param.keyword = "," + param.keyword.trim().replace(/ /g, ',') + ",";
        param.rep_type = 1;
        let keywords = await this.model("keywords").create(param);
        return this.json(keywords)
    }

    async getAction() {
        let param = xss(this.post());
        let keywords = await this.model("keywords").get(param.id);
        return this.json(keywords)
    }

    async updateAction() {
        let param = this.post();
        param.id = parseInt(param.id);
        param.keyword = "," + param.keyword.trim().replace(/ /g, ',') + ",";
        let keywords = await this.model("keywords").edit(param);
        return this.json(keywords)
    }

    async removeAction() {
        let param = xss(this.post());
        let keywords = await this.model("keywords").del(param.id);
        return this.json(keywords)
    }

}
