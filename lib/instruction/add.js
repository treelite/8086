/**
 * @file ADD
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let res = a + b;

        this.cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'add'
        );

        this.dest = res & (this.w ? 0xFFFF : 0xFF);
    },

    codes: {
        0x00: 'Eb Gb',
        0x01: 'Ev Gv',
        0x02: 'Gb Eb',
        0x03: 'Gv Ev',
        0x04: 'AL Ib',
        0x05: 'AX Iv'
    }

};
