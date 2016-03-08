/**
 * @file XCHG
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, REG_ORDER} from '../const';

let instructions = {};

for (let i = 1; i < REG_ORDER.length; i++) {
    let name = REG_ORDER[i];
    instructions[i + 0x90] = {
        name: `XCHG ${name.toUpperCase()} AX`,
        exec: cpu => {
            let tmp = cpu.ax;
            cpu.ax = cpu[name];
            cpu[name] = tmp;
            return 1;
        }
    }
}

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
    name: 'XCHG Gb Eb',
    exec: change()
};

instructions[0x87] = {
    name: 'XCHG Gv Ev',
    exec: change(true)
};

Instruction.register(instructions);
