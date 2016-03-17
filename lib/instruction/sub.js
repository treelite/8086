/**
 * @file sub
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let res = a - b;
        let max = this.w ? 0xFFFF : 0xFF;
        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'sub'
        );
        this.dest = res & max;
    },

    codes: {
        0x28: 'Eb Gb',
        0x29: 'Ev Gv',
        0x2A: 'Gb Eb',
        0x2B: 'Gv Ev',
        0x2C: 'AL Ib',
        0x2D: 'AX Iv'
    }
};
