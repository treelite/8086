/**
 * @file ADD
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING} from '../const';

/**
 * 立即数与计数寄存器累加
 *
 * @param {Object} cpu cpu 对象
 * @return {number}
 */
function addI2A(cpu) {
    let regName = this.w ? 'ax' : 'al';
    let immed = cpu.read(this.ip + 1, this.w);
    cpu[regName] += immed;
    return this.w ? 3 : 2;
}

/**
 * 寄存器与寄存器或者内存之间的累加
 *
 * @param {Object} cpu cpu 对象
 * @return {number}
 */
function addGAndE(cpu) {
    let modRM = this.getModRM(cpu);
    let regName = this.getRegName(modRM.reg);

    if (modRM.mod === REG_ADDRESSING) {
        let name = this.getRegName(modRM.rm);
        if (this.d === 0) {
            cpu[name] += cpu[regName];
        }
        else {
            cpu[regName] += cpu[name];
        }
        return 2;
    }

    let info = this.address(cpu, modRM);
    let value = cpu.read(info.address, this.w);
    if (this.d === 0) {
        cpu.write(info.address, value + cpu[regName], this.w);
    }
    else {
        cpu[regName] += value;
    }
    return 2 + info.size;
}

Instruction.register({

    0x00: {
        name: 'ADD Eb Gb',
        exec: addGAndE,
    },

    0x01: {
        name: 'ADD Ev Gv',
        exec: addGAndE
    },

    0x02: {
        name: 'ADD Gb Eb',
        exec: addGAndE
    },

    0x03: {
        name: 'ADD Gv Ev',
        exec: addGAndE
    },

    0x04: {
        name: 'ADD AL Ib',
        exec: addI2A
    },

    0x05: {
        name: 'ADD AX Iv',
        exec: addI2A
    }

});
