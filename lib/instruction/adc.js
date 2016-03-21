/**
 * @file ADC
 * @author treelite(c.xinle@gmail.com)
 */

import {FLAG_MASK} from '../const';

export default {

    compute() {
        let a = this.dest;
        let b = this.source;
        let cpu = this.cpu;
        let res = a + b;

        if (cpu.getPSW(FLAG_MASK.CF)) {
            res++;
        }

        cpu.setFlag(
            FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
            a, b, res, this.w,
            'add'
        );

        this.dest = res & (this.w ? 0xFFFF : 0xFF);
    },

    codes: {
        0x10: 'Eb Gb',
        0x11: 'Ev Gv',
        0x12: 'Gb Eb',
        0x13: 'Gv Ev',
        0x14: 'AL Ib',
        0x15: 'AX Iv'
    }

};
