'use strict';
/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
            super.init(...args);
            this.tableName = "article";
            this.tablePrefix = "pz_";
        }
        /**
         *  根据父节点获取所有子节点
         * @method checkUserLogin
         * @param  {[type]}       username [description]
         * @param  {[type]}       password [description]
         * @return {[type]}                [description]
         */
    async pageById(ids) {
        let rows = await this.field("id,timg,title,brief,link").where({
                id: ["IN", ids]
            }).select();
        return {
            state: true,
            msg: rows
        };
    }
}
