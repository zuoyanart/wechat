'use strict';
/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
            super.init(...args);
            this.pk = "gbid";
        }
        /**
         *  根据父节点获取所有子节点
         * @method checkUserLogin
         * @param  {[type]}       username [description]
         * @param  {[type]}       password [description]
         * @return {[type]}                [description]
         */
    async page(kw, cp, mp) {
            let rows = await this.where({
                    des: ["like", "%" + kw + "%"],
                    pass: 1
                })
                .order("gbid desc")
                .limit((cp - 1) * mp, mp).select();
            return {
                state: true,
                msg: rows
            };
        }
        /**
         * 创建节点
         * @method create
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
    async create(json) {
            let id = await this.add(json);
            return {
                state: true,
                msg: id
            }
        }

}
