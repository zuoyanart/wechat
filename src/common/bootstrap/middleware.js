// /**
//  * this file will be loaded before server started
//  * you can register middleware
//  * https://thinkjs.org/doc/middleware.html
//  */
//
var wechatMiddleware = require('think-wechat');
think.middleware('parse_wechat', wechatMiddleware({
    pathname: 'wechat/index', //默认，可配置为其他路径，与公众号对应的服务器URL设置一致
    wechat: {
        token: think.config("wx_token"),
        appid: think.config("wx_AppID"),
        encodingAESKey: ''
    },
}));
