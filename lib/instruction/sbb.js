/**
 * @file SBB
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let a = this.dest;
        let b = this.source;
        let cpu = this.cpu;
        let res = a - b;

        if (cpu.getPSW(FLAG_MASK.CF)) {
            res--;
        }

        res = res & (this.w ? 0xFFFF : 0xFF);

        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'sub'
        );

        this.dest = res;
    },

    codes: {
        0x18: 'Eb Gb',
        0x19: 'Ev Gv',
        0x1A: 'Gb Eb',
        0x1B: 'Gv Ev',
        0x1C: 'AL Ib',
        0x1D: 'AX Iv'
    }
};
