'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    domain: 'http://t.lingirl.com',
    db: {
        adapter: {
            mysql: {
                prefix: "pz_wx_",
            },
            mongo: {

            }
        }
    }
};
