/**
 * @file Video
 * @author treelite(c.xinle@gmail.com)
 */

import charm from 'charm';

/**
 * 显卡模拟
 * 直写显存的方式来控制ACSII屏幕
 *
 * @class
 */
export default class {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {number=} width 屏幕宽度 默认80
     * @param {number=} height 屏幕高度 默认20
     */
    constructor(width = 80, height = 25) {
        this.maxWidth = width;
        this.maxHeight = height;
        let screen = this.screen = charm();
        screen.pipe(process.stdout);
        screen.reset();

    }

    /**
     * 写操作
     *
     * @public
     * @param {number} address 显存地址
     * @param {number} data ACSII码
     */
    write(address, data) {
        let width = address % this.maxWidth;
        let height = Math.floor(address / this.maxWidth);
        height = height > this.maxHeight ? this.maxHeight : height;
        this.screen.position(width + 1, height + 1).write(String.fromCharCode(data));
        this.screen.position(1, this.maxHeight + 1);
    }

}
