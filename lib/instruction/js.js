/**
 * @file JS
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let cpu = this.cpu;
        if (cpu.getPSW(FLAG_MASK.SF)) {
            return cpu.ip + this.size + this.dest;
        }
    },

    codes: {
        0x78: 'Jb'
    }
};
