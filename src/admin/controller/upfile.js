'use strict';

import Base from './base.js';
import upload from '../../common/tools/upload.js';
export default class extends Base {
    /**
     * 上传
     * @method uploadAction
     * @return {[type]}     [description]
     */
    async localAction() {
        let uploadCfg = think.config("upload", undefined, "admin");
        console.log(uploadCfg);
        let filepath = "";//上传成功后的路径
        let f = this.file();
        if (uploadCfg.type == "local") {//本地上传
            let tree = this.model("tree");
            let node = await tree.get(this.cookie("nodeid"));
            let mgOption = {};
            if (node.state && node.msg.mgwidth && node.msg.mgwidth > 0) {
                mgOption.width = node.msg.mgwidth;
                mgOption.height = node.msg.mgheight;
            }
            filepath = await upload.localImg(f.imgFile, mgOption);
        } else {
            filepath = await upload.cloudImg(f.imgFile, uploadCfg.qiniu);
        }
        if (filepath != '') {
            return this.json({
                "error": 0,
                "url": filepath
            });
        } else {
            return this.json({
                "error": 1,
                "message": "上传失败"
            });
        }
    }
}
