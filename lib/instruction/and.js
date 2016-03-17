/**
 * @file AND
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let res = a & b;
        this.cpu.setFlag(
            FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
            a, b, res, this.w
        );
        this.dest = res;
    },

    codes: {
        0x20: 'Eb Gb',
        0x21: 'Ev Gv',
        0x22: 'Gb Eb',
        0x23: 'Gv Eb',
        0x24: 'AL Ib',
        0x25: 'AX Iv'
    }

};
