/**
 * 文章系统特有全局函数
 * @method
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
global.Article = {
    /**
     * 格式化article的连接地址
     * @method
     * @param  {[type]} link      =             "" [description]
     * @param  {[type]} articleid =             0  [description]
     * @return {[type]}           [description]
     */
    getLink: (link = "", articleid = 0) => {
        return link == "" ? "/content/" + articleid : link;
    },
    /**
     * 获取缩略图路径
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    getThum: (path, width, height) => {
      return path.replace("/upload/", "/upload/thum/").replace(".", "_" + width + "x" + height + ".");
    }
}
