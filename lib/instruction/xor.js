/**
 * @file XOR
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let res = a ^ b;
        this.cpu.setFlag(
            FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
            a, b, res, this.w
        );
        this.dest = res;
    },

    codes: {
        0x30: 'Eb Gb',
        0x31: 'Ev Gv',
        0x32: 'Gb Eb',
        0x33: 'Gv Ev',
        0x34: 'AL Ib',
        0x45: 'AX Iv'
    }
};
