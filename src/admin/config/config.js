'use strict';
/**
 * config
 */
export default {
  salt: "!rW3N3pJ*$#",//后台加密使用的盐
  upload: {
    type: "local",//local:上传到本地，qiniu：上传到七牛
    qiniu:{
      key:"N2ZLDokzlA6WmlWd_3vVgVQGWrm0EBMKnUNMYZmP",
      secret:"meMtSGAFyt5oA3jSRs7rjI5MrECZ3Ncfi07VffQU",
      bucket:""
    }
  }
};
