/**
 * @file AND
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {FLAG_MASK} from '../const';

function compute(cpu, a, b, w) {
    let res = a & b;
    cpu.setFlag(
        FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
        a, b, res, w
    );
    return res;
}

Instruction.register(
    'and',
    {
        0x20: {
            desc: 'Eb Gb',
            exec: Instruction.createGRM(compute)
        },
        0x21: {
            desc: 'Ev Gv',
            exec: Instruction.createGRM(compute)
        },
        0x22: {
            desc: 'Gb Eb',
            exec: Instruction.createGRM(compute)
        },
        0x23: {
            desc: 'Gv Eb',
            exec: Instruction.createGRM(compute)
        },

        0x24: {
            desc: 'AL Ib',
            exec: Instruction.createIA(compute)
        },
        0x25: {
            desc: 'AX Iv',
            exec: Instruction.createIA(compute)
        }
    }
);
