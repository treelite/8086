/**
 * @file PUSH
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ORDER, SEG_REG_ORDER} from '../const';

let instructions = {};

// 段寄存器相关的 PUSH 操作
SEG_REG_ORDER.forEach((name, index) => {
    index = (index << 3) + 6;
    instructions[index] = {
        desc: name.toUpperCase(),
        exec: cpu => {
            cpu.push(cpu[name]);
            return 1;
        }
    };
});

// 普通寄存器相关的 PUSH 操作
let registers = REG_ORDER[1];
registers.forEach((name, index) => {
    index += 0x50;
    instructions[index] = {
        desc: name.toUpperCase(),
        exec: cpu => {
            cpu.push(cpu[name]);
            return 1;
        }
    };
});

Instruction.register('push', instructions);
