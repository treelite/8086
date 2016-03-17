/**
 * @file DEC
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let a = this.dest;
        let b = 1;
        let res = a - b;
        let max = this.w ? 0xFFFF : 0xFF;

        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'sub'
        );

        this.dest = res & max;
    },

    codes: {
        0x48: 'AX',
        0x49: 'CX',
        0x4A: 'DX',
        0x4B: 'BX',
        0x4C: 'SP',
        0x4D: 'BP',
        0x4E: 'SI',
        0x4F: 'DI'
    }
};
