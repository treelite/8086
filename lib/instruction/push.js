/**
 * @file PUSH
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

let instructions = {};

// 段寄存器相关的 PUSH 操作
let segmentRegisters = ['es', 'cs', 'ss', 'ds'];
segmentRegisters.forEach((name, index) => {
    index = (index << 3) + 6;
    instructions[index] = {
        name: 'PUSH ' + name.toUpperCase(),
        exec: cpu => {
            cpu.push(cpu[name]);
            return 1;
        }
    };
});

// 普通寄存器相关的 PUSH 操作
let registers = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'];
registers.forEach((name, index) => {
    index += 0x50;
    instructions[index] = {
        name: 'PUSH ' + name.toUpperCase(),
        exec: cpu => {
            cpu.push(cpu[name]);
            return 1;
        }
    };
});

Instruction.register(instructions);
