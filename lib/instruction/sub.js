/**
 * @file sub
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, FLAG_MASK} from '../const';

function compute(cpu, a, b, w) {
    let res = a - b;
    cpu.setFlag(
        FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
        a, b, res, w,
        'sub'
    );
    return res;
}

function subI4A(cpu) {
    let immed = cpu.read(this.ip + 1, this.w);
    let regName = this.w ? 'ax' : 'al';

    cpu[regName] = compute(cpu, cpu[regName], immed, this.w);
    return this.w ? 3 : 2;
}

function subGandE(cpu) {
    let modRM = this.getModRM(cpu);
    let regName = this.getRegName(modRM.reg);

    if (modRM.mod === REG_ADDRESSING) {
        let name = this.getRegName(modRM.rm);
        if (this.d) {
            cpu[regName] = compute(cpu, cpu[regName], cpu[name], this.w);
        }
        else {
            cpu[name] = compute(cpu, cpu[name], cpu[regName], this.w);
        }
        return 2;
    }

    let info = this.address(cpu, modRM);
    let value = cpu.read(info.address, this.w);
    if (this.d) {
        cpu[regName] = compute(cpu, cpu[regName], value, this.w);
    }
    else {
        let res = compute(cpu, value, cpu[regName], this.w);
        cpu.write(info.address, res, this.w);
    }
    return 2 + info.size;
}

Instruction.register(
    'sub',
    {
        0x28: {
            desc: 'Eb Gb',
            exec: subGandE
        },
        0x29: {
            desc: 'Ev Gv',
            exec: subGandE
        },
        0x2A: {
            desc: 'Gb Eb',
            exec: subGandE
        },
        0x2B: {
            desc: 'Gv Ev',
            exec: subGandE
        },
        0x2C: {
            desc: 'AL Ib',
            exec: subI4A
        },
        0x2D: {
            desc: 'AX Iv',
            exec: subI4A
        }
    }
);
