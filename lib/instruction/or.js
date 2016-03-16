/**
 * @file OR
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {FLAG_MASK} from '../const';

function compute(cpu, a, b, w) {
    let res = a | b;
    cpu.setFlag(
        FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
        a, b, res, w
    );
    return res;
}

Instruction.register(
    'and',
    {
        0x08: {
            desc: 'Eb Gb',
            exec: Instruction.createGRM(compute)
        },
        0x09: {
            desc: 'Ev Gv',
            exec: Instruction.createGRM(compute)
        },
        0x0A: {
            desc: 'Gb Eb',
            exec: Instruction.createGRM(compute)
        },
        0x0B: {
            desc: 'Gv Eb',
            exec: Instruction.createGRM(compute)
        },

        0x0C: {
            desc: 'AL Ib',
            exec: Instruction.createIA(compute)
        },
        0x0D: {
            desc: 'AX Iv',
            exec: Instruction.createIA(compute)
        }
    }
);
