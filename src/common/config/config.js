'use strict';
/**
 * config
 */
export default {
  port: 8371,
  host: "",
  timeout: 60, //60s
  route_on: true,//开始自定义路由
  resource_on: true, //是否开启静态资源解析功能
  resource_reg: /^((static|upload)\/|[^\/]+\.(?!js|html|jpg|png|jpeg)\w+$)/, //判断为静态资源请求的正则
  log_error: true, //是否打印错误日志
  default_module: "home",
  default_controller: "index",
  default_action: "index",
  json_content_type: "application/json",
  openApi: false,
  api: 'http://192.168.1.134:4000/v1/',
  wx_AppID:'wxd01c0276b265afaf',
  wx_AppSecret:"873f7737de041d73f864867fe4e2bcad",
  wx_token:"XXZI7Q7QUUZXDKDS2ZQHCUC7EDOCCYIM"
};
