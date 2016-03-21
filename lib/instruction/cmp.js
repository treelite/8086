/**
 * @file CMP
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let a = this.dest;
        let b = this.source;
        let res = (a - b) & (this.w ? 0xFFFF : 0xFF);

        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'sub'
        );
    },

    codes: {
        0x38: 'Eb Gb',
        0x39: 'Ev Gv',
        0x3A: 'Gb Eb',
        0x3B: 'Gv Ev',
        0x3C: 'AL Ib',
        0x3D: 'AX Iv'
    }
};
