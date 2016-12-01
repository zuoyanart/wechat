'use strict';
/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
            super.init(...args);
            this.tableName = "node"; //将对应的数据表名设置为 user2
        }
        /**
         *  根据父节点获取所有子节点
         * @method checkUserLogin
         * @param  {[type]}       username [description]
         * @param  {[type]}       password [description]
         * @return {[type]}                [description]
         */
    async page(pid) {
            let rows = await this.where({
                "pid": pid,
                "ishide":0
            }).select();
            return {
                state: true,
                msg: rows
            }
        }
        /**
         * 获取同级姊妹节点
         * @method crumbs
         * @param  {[type]} pid [description]
         * @return {[type]}     [description]
         */
    async pageSister(nodeid) {
            let node = await this.get(nodeid);
            let rows = await this.page(node.msg.pid);
            return {
                state: true,
                msg: rows.msg
            }
        }
        /**
         * 获取面包屑
         * @method crumbs
         * @param  {[type]} pid [description]
         * @return {[type]}     [description]
         */
    async crumbs(nodeid) {
            let data;
            let ids = await this.get(nodeid);
            if (ids.state == true) {
                ids = ",0" + ids.msg.nodepath + "0,";
                ids = ids.replace(/,0,/g, "");
                data = await this.where({
                    id: ["IN", ids],
                    "ishide":0
                }).field("id,name,link").order("nodepath asc,weight desc").select();
                return {
                    state: true,
                    msg: data
                }
            }
            return {
                state: false,
                msg: []
            }

        }
        /**
         * 获取节点by id
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async get(nodeid) {
        let row = await this.where({
            id: nodeid
        }).find();
        return {
            state: true,
            msg: row
        }
    }

}
