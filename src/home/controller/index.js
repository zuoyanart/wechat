'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let node = this.model("tree");
        let article = this.model("article");
        let requests = [];
        requests.push(node.page(1));
        requests.push(article.page("", 3, 1, 10));
        requests.push(article.page("", 4, 1, 10));
        requests.push(article.page("", 5, 1, 10));
        requests.push(article.page("", 6, 1, 10));
        requests.push(article.page("", 7, 1, 10));
        requests.push(article.page("", 8, 1, 10));
        requests.push(article.page("", 9, 1, 10));
        requests.push(article.page("", 10, 1, 10));
        let results = await Promise.all(requests);
        this.assign({
            node: results[0].msg,
            article: results
                //  a2: results[2].msg,
                //  a3: results[3].msg,
                //  a4: results[4].msg,
                //  a5: results[5].msg,
                //  a6: results[6].msg,
                //  a7: results[7].msg,
                //  a8: results[8].msg,
        });
        return this.display();
    }

    async visitAction() {
        let a = await superagent("http://192.168.1.143:3004/v1/visit/547809a3207430d77f000006", "put", {
            uid: '544e007daeec3f2911000001',
            nid: 1,
            nickname: '土著',
            avatar: '/2014/12/24/549a28cacecd4f4a42000017.jpg'
        });
        return this.json(a);
    }
}
