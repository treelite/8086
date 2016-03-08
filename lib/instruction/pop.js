/**
 * @file POP
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ORDER, SEG_REG_ORDER, REG_ADDRESSING} from '../const';

let instructions = {};

// 段寄存器相关的 POP 操作
SEG_REG_ORDER.forEach((name, index) => {
    index = (index << 3) + 7;
    instructions[index] = {
        name: 'PUSH ' + name.toUpperCase(),
        exec: cpu => {
            cpu[name] = cpu.pop();
            return 1;
        }
    };
});

// 普通寄存器相关的 POP 操作
REG_ORDER.forEach((name, index) => {
    index += 0x58;
    instructions[index] = {
        name: 'PUSH ' + name.toUpperCase(),
        exec: cpu => {
            cpu[name] = cpu.pop();
            return 1;
        }
    };
});

instructions[0x8F] = {
    name: 'POP Ev',
    exec: function (cpu) {
        let modRM = this.getModRM(cpu);
        if (modRM === REG_ADDRESSING) {
            cpu[this.getRegName(modRM.rm)] = cpu.pop();
            return 2;
        }
        let info = this.address(cpu, modRM);
        cpu.write(info.address, cpu.pop(), true);
        return 2 + info.size;
    }
};

Instruction.register(instructions);
