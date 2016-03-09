/**
 * @file GRP
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING} from '../const';

/**
 * GROUP 1 Name
 *
 * @const
 * @type {Array}
 */
const GRP1_NAME = ['ADD', 'OR', 'ADC', 'SBB', 'AND', 'SUB', 'XOR', 'CMP'];

/**
 * GROUP 5 Name
 *
 * @const
 * @type {Array}
 */
const GRP5_NAME = ['INC', 'DEC', 'CALL', 'CALL', 'JMP', 'JMP', 'PUSH'];

/**
 * GROUP 5 Exec
 *
 * @const
 * @type {Object}
 */
const GRP5_EXEC = {
    // Push register/memory
    PUSH: function (cpu) {
        let modRM = this.getModRM(cpu);
        if (modRM.mod === REG_ADDRESSING) {
            cpu.push(cpu[this.getRegName(modRM.rm)]);
            return 2;
        }
        let info = this.address(cpu, modRM);
        cpu.push(cpu.read(info.address, true));
        return 2 + info.size;
    }
};

/**
 * GROUP 1 Exec
 *
 * @const
 * @type {Object}
 */
const GRP1_EXEC = {
    // Add Immedate to register/memory
    ADD: function (cpu) {
        let modRM = this.getModRM(cpu);
        let extension = this.d === 0 && this.w === 1;
        if (modRM.mod === REG_ADDRESSING) {
            let regName = this.getRegName(modRM.rm);
            let immed = cpu.read(this.ip + 2, extension);
            cpu[regName] += immed;
            return 2 + (extension ? 2 : 1);
        }

        let info = this.address(cpu, modRM);
        let value = cpu.read(info.address, this.w);
        let immed = cpu.read(this.ip + 2 + info.size, extension);
        cpu.write(info.address, value + immed, this.w);
        return 2 + info.size + (extension ? 2 : 1);
    }
};

let instructions = {};

/**
 * 注册 GROUP 指令
 *
 * @param {number} code opCode
 * @param {string} name 指令名称
 * @param {Object} nameSource 扩展指令名称集合
 * @param {Object} execSource 扩展指令功能集合
 */
function register(code, name, nameSource, execSource) {
    instructions[code] = {
        name: name,
        exec: function (cpu) {
            let name = this.getSubName(cpu);
            return execSource[name].call(this, cpu);
        },
        getSubName: function (cpu) {
            let modRM = this.getModRM(cpu);
            return nameSource[modRM.reg];
        }
    };
}

register(0xFF, 'GRP5 Ev', GRP5_NAME, GRP5_EXEC);
register(0x80, 'GRP1 Eb Ib', GRP1_NAME, GRP1_EXEC);
register(0x81, 'GRP1 Ev Iv', GRP1_NAME, GRP1_EXEC);
register(0x82, 'GRP1 Eb Ib', GRP1_NAME, GRP1_EXEC);
register(0x83, 'GRP1 Ev Ib', GRP1_NAME, GRP1_EXEC);

Instruction.register(instructions);
