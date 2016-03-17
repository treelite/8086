/**
 * @file JBE
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let cpu = this.cpu;
        if (cpu.getPSW(FLAG_MASK.ZF) || cpu.getPSW(FLAG_MASK.CF)) {
            return cpu.ip + this.size + this.dest;
        }
    },

    codes: {
        0x76: 'Jb'
    }
};
