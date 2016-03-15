/**
 * @file GRP 1
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, FLAG_MASK} from '../const';

/**
 * GROUP 1 Name
 *
 * @const
 * @type {Array}
 */
const TYPES = ['ADD', 'OR', 'ADC', 'SBB', 'AND', 'SUB', 'XOR', 'CMP'];

/**
 * GROUP 1 Exec
 *
 * @const
 * @type {Object}
 */
const EXEC = {
    // Add Immedate to register/memory
    ADD: function (cpu) {
        let modRM = this.getModRM(cpu);
        let extension = this.d === 0 && this.w === 1;
        let compute = (a, b) => {
            let max = this.w ? 0xFFFF : 0xFF;
            let res = a + b;
            cpu.setFlag(
                FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
                a, b, res, this.w,
                'add'
            );
            return res & max;
        };

        if (modRM.mod === REG_ADDRESSING) {
            let regName = this.getRegName(modRM.rm);
            let immed = cpu.read(this.ip + 2, extension);
            cpu[regName] = compute(cpu[regName], immed);
            return 2 + (extension ? 2 : 1);
        }

        let info = this.address(cpu, modRM);
        let value = cpu.read(info.address, this.w);
        let immed = cpu.read(this.ip + 2 + info.size, extension);
        cpu.write(info.address, compute(value, immed), this.w);
        return 2 + info.size + (extension ? 2 : 1);
    }
};

let instructions = {};

/**
 * 注册 GROUP 指令
 *
 * @param {number} code opCode
 * @param {string} desc 指令描述
 */
function register(code, desc) {
    instructions[code] = {
        desc: desc,
        exec: function (cpu) {
            let modRM = this.getModRM(cpu);
            let type = this.subType = TYPES[modRM.reg];
            return EXEC[type].call(this, cpu);
        }
    };
}

register(0x80, 'Eb Ib');
register(0x81, 'Ev Iv');
register(0x82, 'Eb Ib');
register(0x83, 'Ev Ib');

Instruction.register('grp1', instructions);
