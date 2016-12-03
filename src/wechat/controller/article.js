'use strict';

import Base from './base.js';
export default class extends Base {

    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let param = xss(this.post());
        param.ids = param.ids.split(',');
        let len = param.ids.length > 5 ? 5 : param.ids.length;
        let ids = [];
        for (let i = 0; i < len; i++) {
            ids.push(param.ids[i]);
        }
        let articleM = this.model("article");
        let row = await articleM.pageById(ids);
        return this.json(row);
    }

}
