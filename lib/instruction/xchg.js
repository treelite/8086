/**
 * @file XCHG
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, REG_ORDER} from '../const';

let instructions = {};

// 寄存器与计数寄存器之间的交换
let registers = REG_ORDER[1];
for (let i = 1; i < registers.length; i++) {
    let name = registers[i];
    instructions[i + 0x90] = {
        desc: `${name.toUpperCase()} AX`,
        exec: cpu => {
            let tmp = cpu.ax;
            cpu.ax = cpu[name];
            cpu[name] = tmp;
            return 1;
        }
    };
}

/**
 * 寄存器与寄存器或者内存之间的交换
 *
 * @param {boolean} word byte or word
 * @return {Function}
 */
function change(word) {
    return function (cpu) {
        let modRM = this.getModRM(cpu);
        let regName = this.getRegName(modRM.reg);
        let tmp = cpu[regName];

        if (modRM.mod === REG_ADDRESSING) {
            let destRegName = this.getRegName(modRM.rm);
            cpu[regName] = cpu[destRegName];
            cpu[destRegName] = tmp;
            return 2;
        }

        let info = this.address(cpu, modRM);
        cpu[regName] = cpu.read(info.address, word);
        cpu.write(info.address, tmp, word);
        return 2 + info.size;
    };
}

instructions[0x86] = {
    desc: 'Gb Eb',
    exec: change()
};

instructions[0x87] = {
    desc: 'Gv Ev',
    exec: change(true)
};

Instruction.register('xchg', instructions);
