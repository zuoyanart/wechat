/**
 * 文章相关操作
 * @method
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
let img = (function() {
    let $ = require('jquery');
    let tools = require('pizzatools');
    let common = require('common/common');
    let node = require('admin/tree/tree');
    let trunpage = require("trunpage/trunpage"); //获取翻页
    let pizzalayer = require("pizzalayer"); //获取翻页
    let tppage = null; //翻页的实例化

    require('pizzaui');
    let my = {};
    let options = {
        url: '/wechat/img/',
        tpl: __inline('../ejs/text.ejs'),
        cp: 1,
        mp: 20
    };
    let isScroll = true;

    /**
     * 初始化执行函数
     * @method function
     * @return {[type]} [description]
     */
    my.init = function() {
            eventBind(); //绑定所有交互操作
            scrollEvent(); //绑定滚动条事件
            common.checkAll('#checkall'); //checkall
            //绑定节点切换事件
            page(1);
            common.kwSearch('#searchkw', function() {
                page(1);
            });
        }
        /**
         * 编辑文章
         * @method function
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    my.get = function() {
            let id = tools.getPara("id");
            if (id == "") {
                return;
            }
            $.ajax({
                url: options.url + 'get',
                data: 'id=' + id,
                success: function(msg) {
                    if (msg.state == true) {
                        $('#keyword').val((msg.msg["keyword"]).replace(/,/g, " ").trim());
                        $('#content').val(msg.msg["content"]);
                    }
                }
            });
        }
        /**
         * 展示图文效果
         * @method getArticle
         * @param  {[type]}   obj [description]
         * @return {[type]}       [description]
         */
        my.getArticle = function(obj) {
            let ids = obj.val().trim();
            $.ajax({
                url: "/wechat/article",
                data: "ids=" + ids,
                success: function(msg) {
                    let doc = msg.msg;
                    let s = '<ul class="item-ul">';
                    for (let i = 0, l = doc.length; i < l; i++) {
                        if (i == 0) {
                            s += '<li class="item-1"><img src="'+doc[i].timg+'" /><label>'+doc[i].title+'</label></li>';
                        } else {
                          s += '<li class="item-2"><div>'+doc[i].title+'</div><img src="'+doc[i].timg+'" /></li>';
                        }
                    }
                    s += "</ul>";
                    $("#demo").html(s);
                }
            });
        }
        /**
         * 编辑文章
         * @method function
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    my.edit = function() {
            $(".form").pizzaValidate({
                'fields': {
                    '#keyword': {
                        'must': true,
                        'minLength': 1,
                        'maxLength': 100,
                        focusMsg: "请输入触发关键字",
                        errMsg: '关键字不能为空且必须在1-100个字符之间，多个用空格隔开'
                    },
                    '#content': {
                        'must': true,
                        'minLength': 1,
                        'maxLength': 50,
                        focusMsg: "请输入文章的id，最多5篇文章",
                        errMsg: '请输入文章的id，最多5篇文章'
                    }
                },
                ajaxFun: function(data) {
                    let id = tools.getPara("id");
                    let op = "create";
                    if (id != "") {
                        op = "update";
                        data += '&id=' + id;
                    }
                    $.ajax({
                        url: options.url + op,
                        data: data,
                        success: function(msg) {
                            if (msg.state == true) {
                                history.back();
                            }
                        }
                    });
                }
            });
        }
        /**
         * 获取文章列表
         * @method page
         * @return {[type]} [description]
         */
    function page(cp, mp) {
        if (cp) {
            options.cp = cp;
        }
        $.ajax({
            url: options.url + 'page',
            data: 'cp=' + options.cp + '&mp=' + options.mp + '&kw=' + $.trim($('#searchkw').val()),
            success: function(msg) {
                let s = new EJS({
                    text: options.tpl
                }).render({
                    data: msg.msg
                });
                if (cp == 1) {
                    $('#list').html(s);
                } else {
                    $('#list').append(s);
                }
                options.cp += 1;
                isScroll = true;
            }
        });
    }
    /**
     * 操作事件绑定
     * @method eventBind
     * @return {[type]}  [description]
     */
    function eventBind() {
        $('#list').on('click', 'li > span > i', function() {
            let cl = $(this).attr('class');
            if (cl) {
                action[cl].call(this, $(this));
            }
        });
        $('#main > div.menu').on('click', 'em', function() {
            let cl = $(this).attr('class');
            if (cl) {
                action[cl].call(this, $(this));
            }
        });
    }
    /**
     * 滚动条滚动事件
     * @method scrollEvent
     * @return {[type]}    [description]
     */
    function scrollEvent() {
        $(window).scroll(function() {
            let docHeight = document.body.scrollHeight;
            let scrollTop = 0; //滚动条高度
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            let bottomHeight = docHeight - scrollTop - $(window).height();
            //console.log(bottomHeight);
            //console.log(isScroll);
            if (bottomHeight < 100 && isScroll == true) {
                page();
                isScroll = false;
            }
        });
    }
    /////action
    let action = {};
    /**
     *
     * @method remove
     * @return {[type]} [description]
     */
    action.remove = function(obj) {
        let id = common.getCheckId(obj);
        if (id == '0') {
            return;
        }
        layer.confirm("确定要删除吗？", {
            icon: 3,
            title: '警告'
        }, function(index) {
            $.ajax({
                url: options.url + 'remove',
                data: 'id=' + id,
                success: function(msg) {
                    if (msg.state == true) {
                        let ids = id.split(',');
                        layer.close(index);
                        for (let i = 0, ll = ids.length; i < ll; i++) {
                            $('#article_' + ids[i]).parent().parent().remove();
                        }
                    }
                }
            });
        });
    }

    return my;
}());

module.exports = img;
