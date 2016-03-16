/**
 * @file CMP
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, FLAG_MASK} from '../const';

function compute(cpu, a, b, w) {
    cpu.setFlag(
        FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
        a, b, a - b, w,
        'sub'
    );
}

function cmpI4A(cpu) {
    let immed = cpu.read(this.ip + 1, this.w);
    let regName = this.w ? 'ax' : 'al';

    compute(cpu, cpu[regName], immed, this.w);
    return this.w ? 3 : 2;
}

function cmpGAndE(cpu) {
    let modRM = this.getModRM(cpu);
    let regName = this.getRegName(modRM.reg);

    if (modRM.mod === REG_ADDRESSING) {
        let name = this.getRegName(modRM.rm);
        if (this.d) {
            compute(cpu, cpu[regName], cpu[name], this.w);
        }
        else {
            compute(cpu, cpu[name], cpu[regName], this.w);
        }
        return 2;
    }

    let info = this.address(cpu, modRM);
    let value = cpu.read(info.address, this.w);
    if (this.d) {
        compute(cpu, cpu[regName], value, this.w);
    }
    else {
        compute(cpu, value, cpu[regName], this.w);
    }
    return 2 + info.size;
}

Instruction.register(
    'cmp',
    {
        0x38: {
            desc: 'Eb Gb',
            exec: cmpGAndE
        },
        0x39: {
            desc: 'Ev Gv',
            exec: cmpGAndE
        },
        0x3A: {
            desc: 'Gb Eb',
            exec: cmpGAndE
        },
        0x3B: {
            desc: 'Gv Ev',
            exec: cmpGAndE
        },
        0x3C: {
            desc: 'AL Ib',
            exec: cmpI4A
        },
        0x3D: {
            desc: 'AX Iv',
            exec: cmpI4A
        }
    }
);
