/**
 * @file OR
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let res = a | b;
        this.cpu.setFlag(
            FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
            a, b, res, this.w
        );
        this.dest = res;
    },

    codes: {
        0x08: 'Eb Gb',
        0x09: 'Ev Gv',
        0x0A: 'Gb Eb',
        0x0B: 'Gv Ev',
        0x0C: 'AL Ib',
        0x0D: 'AX Iv'
    }

};
