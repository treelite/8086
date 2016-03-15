/**
 * @file ADD
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, FLAG_MASK} from '../const';

/**
 * Add 计算
 *
 * @param {Object} cpu cpu 对象
 * @param {number} a 操作数1
 * @param {number} b 操作数2
 * @param {number=} w 字节操作还是字操作
 * @return {number}
 */
function compute(cpu, a, b, w) {
    let res = a + b;
    let word = arguments.length >= 4 ? w : this.w;

    cpu.setFlag(
        FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
        a, b, res, word,
        'add'
    );
    return res & (word ? 0xFFFF : 0xFF);
}

/**
 * 立即数与计数寄存器累加
 *
 * @param {Object} cpu cpu 对象
 * @return {number}
 */
function addI2A(cpu) {
    let regName = this.w ? 'ax' : 'al';
    let immed = cpu.read(this.ip + 1, this.w);
    cpu[regName] = this.compute(cpu, cpu[regName], immed);
    return this.w ? 3 : 2;
}

/**
 * 寄存器与寄存器或者内存之间的累加
 *
 * @param {Object} cpu cpu 对象
 * @return {number}
 */
function addGAndE(cpu) {
    let res;
    let modRM = this.getModRM(cpu);
    let regName = this.getRegName(modRM.reg);

    if (modRM.mod === REG_ADDRESSING) {
        let name = this.getRegName(modRM.rm);
        res = this.compute(cpu, cpu[regName], cpu[name]);
        if (this.d === 0) {
            cpu[name] = res;
        }
        else {
            cpu[regName] = res;
        }
        return 2;
    }

    let info = this.address(cpu, modRM);
    let value = cpu.read(info.address, this.w);
    res = this.compute(cpu, cpu[regName], value);
    if (this.d === 0) {
        cpu.write(info.address, res, this.w);
    }
    else {
        cpu[regName] = res;
    }
    return 2 + info.size;
}

Instruction.register(
    'add',
    {
        0x00: {
            desc: 'Eb Gb',
            exec: addGAndE
        },

        0x01: {
            desc: 'Ev Gv',
            exec: addGAndE
        },

        0x02: {
            desc: 'Gb Eb',
            exec: addGAndE
        },

        0x03: {
            desc: 'Gv Ev',
            exec: addGAndE
        },

        0x04: {
            desc: 'AL Ib',
            exec: addI2A
        },

        0x05: {
            desc: 'AX Iv',
            exec: addI2A
        }
    },
    {compute}
);
