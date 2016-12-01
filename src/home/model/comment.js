'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     *  根据父节点获取所有子节点
     * @method checkUserLogin
     * @param  {[type]}       username [description]
     * @param  {[type]}       password [description]
     * @return {[type]}                [description]
     */
    async page(articleid, cp, mp) {
        let rows = await this.where({
                articleid: articleid
            })
            .order("id desc")
            .limit((cp - 1) * mp, mp).countSelect();
        return {
            state: true,
            msg: rows.data,
            count: rows.count
        };
    }

    /**
     * 创建评论
     * @method create
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    async create(cmt) {
        // block.content = unescape(block.content);
        let id = await this.add(cmt);
        return {
            state: true,
            msg: id
        }
    }
}
