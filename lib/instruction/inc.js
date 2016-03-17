/**
 * @file INC
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {
    compute() {
        let a = this.dest;
        let b = 1;
        let res = a + b;
        let max = this.w ? 0xFFFF : 0xFF;

        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w
        );

        this.dest = res & max;
    },

    codes: {
        0x40: 'AX',
        0x41: 'CX',
        0x42: 'DX',
        0x43: 'BX',
        0x44: 'SP',
        0x45: 'BP',
        0x46: 'SI',
        0x47: 'DI'
    }
};
