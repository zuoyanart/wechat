'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
    /**
     * index action logic
     * @return {} []
     */
    indexAction() {
            this.rules = {
                nodeid: "required|int:1,1000000",
                cp: "int:1,10000",
                mp: "int:1,100"
            }
        }
        /**
         * index action logic
         * @return {} []
         */
    imgAction() {
            this.rules = {
                nodeid: "required|int:1,1000000",
                cp: "int:1,10000",
                mp: "int:1,100"
            }
        }
        /**
         * index action logic
         * @return {} []
         */
    nodeAction() {
        this.rules = {
            nodeid: "required|int:1,1000000",
            cp: "int:1,10000",
            mp: "int:1,100"
        }
    }
}
