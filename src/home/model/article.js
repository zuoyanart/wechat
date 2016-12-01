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
    async page(kw = "", nodeid = 1, cp = 1, mp = 20, options = {
            turnpage: false
        }) {
            if (think.config("openApi")) {
                let article = await httpAgent(this.config("api") + 'article/page', "post", "kw=" + kw + "&cp=" + cp + "&mp=" + mp + "&nodeid=" + nodeid);
                return article;
            } else {
                let resultOptions = {
                    where: {
                        "article.pass": 1,
                        "node.nodepath": ["like", "%," + nodeid + ",%"]
                    },
                    order: "article.id desc"
                };
                if (kw != "") {
                    resultOptions.where["article.title"] = ["like", "%" + kw + "%"];
                }
                if (!options.where) {
                    options.where = {};
                }
                if (!options.order) {
                    options.order = "article.id desc";
                }
                for (let key in options.where) {
                    resultOptions.where[key] = options.where[key];
                }
                resultOptions.order = options.order;

                let rowsPromise = this.alias("article").join({
                        table: "node",
                        as: "node",
                        join: "inner",
                        on: ["article.nodeid", "node.id"]
                    }).join({
                        table: "user_admin",
                        as: "user",
                        join: "inner",
                        on: ["article.uid", "id"]
                    })
                    .where(resultOptions.where);

                if (options.turnpage === true) {
                    let rows = await rowsPromise.field("article.id,article.title,article.timg,article.brief,article.nodeid,article.source,article.link,article.comment,article.createtime,node.name as nodename,user.username").order(resultOptions.order)
                        .limit((cp - 1) * mp, mp).countSelect();

                    return {
                        state: true,
                        msg: rows.data,
                        count: rows.count
                    };
                } else {
                    let rows = await rowsPromise.field("article.id,article.title,article.timg,article.brief,article.nodeid,article.source,article.link,article.comment,article.createtime,node.name as nodename,user.username").order(resultOptions.order)
                        .limit((cp - 1) * mp, mp).select();

                    return {
                        state: true,
                        msg: rows,
                    };
                }
            }
        }
        /**
         * 获取文章by id
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async get(id) {
            if (think.config("openApi")) {
                let article = await httpAgent(this.config("api") + 'article/' + parseInt(id), "get");
                return article;
            } else {
              let rowsPromise = this.alias("article").join({
                   table: "node",
                   as: "node",
                   join: "inner",
                   on: ["article.nodeid", "node.id"]
               }).join({
                   table: "user_admin",
                   as: "user",
                   join: "inner",
                   on: ["article.uid", "id"]
               }).where({"article.id": id, "article.pass": 1});

               let row = await rowsPromise.field("article.id,article.title,article.timg,article.brief,article.content,article.nodeid,article.source,article.link,article.comment,article.createtime,node.name as nodename,user.username").find();

                let rows = await this.where({//点击加一
                    id: id
                }).increment("count", 1);
                return {
                    state: true,
                    msg: row
                }
            }
        }
        /**
         * 获取文章by id,不管是否审核
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async getPreview(id) {
        if (think.config("openApi")) {
            let article = await httpAgent(this.config("api") + 'article/' + parseInt(id), "get");
            return article;
        } else {
            let row = await this.where({
                id: id
            }).find();
            return {
                state: true,
                msg: row
            }
        }
    }
}
