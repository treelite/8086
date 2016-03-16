/**
 * @file XOR
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {FLAG_MASK} from '../const';

function compute(cpu, a, b, w) {
    let res = a ^ b;
    cpu.setFlag(
        FLAG_MASK.OF | FLAG_MASK.CF | FLAG_MASK.SF | FLAG_MASK.ZF | FLAG_MASK.PF,
        a, b, res, w
    );
    return res;
}

Instruction.register(
    'and',
    {
        0x30: {
            desc: 'Eb Gb',
            exec: Instruction.createGRM(compute)
        },
        0x31: {
            desc: 'Ev Gv',
            exec: Instruction.createGRM(compute)
        },
        0x32: {
            desc: 'Gb Eb',
            exec: Instruction.createGRM(compute)
        },
        0x33: {
            desc: 'Gv Eb',
            exec: Instruction.createGRM(compute)
        },

        0x34: {
            desc: 'AL Ib',
            exec: Instruction.createIA(compute)
        },
        0x45: {
            desc: 'AX Iv',
            exec: Instruction.createIA(compute)
        }
    }
);
