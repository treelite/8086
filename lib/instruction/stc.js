/**
 * @file STC
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        this.cpu.setPSW(FLAG_MASK.CF, 1);
    },

    codes: {
        0xF9: ''
    }
};
