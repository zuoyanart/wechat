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
    async page(kw, reptype, cp, mp) {
            let rows = await this.where({
                    keyword: ["like", "%" + kw + "%"],
                    rep_type: reptype
                })
                .order("id desc")
                .limit((cp - 1) * mp, mp).select();
            return {
                state: true,
                msg: rows
            };
        }
        /**
         * 获取文章by id
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async get(id) {
            let row = await this.where({
                id: id
            }).find();
            return {
                state: true,
                msg: row
            }
        }
        /**
         * 获取文章by id
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async getByWorld(keyword) {
            let row = await this.where({
                keyword: ["like", "%," + keyword + ",%"],
                rep_type: {
                    '<': 500
                }
            }).order("id desc").find();
            return row
        }
        /**
         * 获取文章by id
         * @method get
         * @param  {[type]} nodeid [description]
         * @return {[type]}        [description]
         */
    async getByType(reptype = 500) {
            let row = await this.where({
                rep_type: reptype
            }).order("id desc").find();
            return row
        }
        /**
         * 更新节点
         * @method update
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
    async edit(block) {
            block.content = unescape(block.content);
            let row = await this.update(block);
            return {
                state: true
            }
        }
        /**
         * 创建节点
         * @method create
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
    async create(block) {
            block.content = unescape(block.content);
            let id = await this.add(block);
            return {
                state: true,
                msg: id
            }
        }
        /**
         * 删除文章
         * @method del
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
    async del(id) {
            let row = await this.where({
                id: ["IN", id.split(',')]
            }).delete();
            return {
                state: true
            }
        }
        /**
         * 回复的业务逻辑操作
         * @method reply
         * @param  {[type]} keyword [description]
         * @return {[type]}         [description]
         */
    async reply(keyword, getDefault = false) {
            let message = ""; //默认回复的内容
            let articleM = this.model("article");
            let content = await this.getByWorld(keyword);
            if (think.isEmpty(content)) {
                if (!getDefault) { //不是从getDefault调用过来的
                    return await this.getDefaultReply();
                } else {
                    return "";
                }
            }
            switch (content.rep_type) { //回复类型
                case 0: //文本
                    message = content.content;
                    break;
                case 1: //图文
                    let articles = await articleM.pageById(content.content);
                    let articleMsg = articles.msg;
                    let articleJson = [];
                    console.log(think.config("domain"));
                    for (let i = 0, l = articleMsg.length; i < l; i++) {
                        articleJson.push({
                            title: articleMsg[i].title,
                            description: articleMsg[i].brief,
                            picurl: 'http://t.lingirl.com' + articleMsg[i].timg,
                            url:'http://t.lingirl.com' + articleMsg[i].link
                        });
                    }
                    message = articleJson;
                    break;
            }
            if (message == "" && !getDefault) {
                message = await this.getDefaultReply();
            }
            console.log(message);
            return message;
        }
        /**
         * 获取默认回复
         * @method getDefaultReply
         * @return {[type]}        [description]
         */
    async getDefaultReply() {
        let message = await this.getByType(501);
        if (message.keyword == "") {
            message = "";
        } else {
            message = this.reply(message.keyword, true);
        }
        return message;
    }
}
