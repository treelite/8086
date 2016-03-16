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
 * 生成指令执行函数
 *
 * @param {Function} compute 数学运算
 * @return {Function}
 */
function generateExec(compute) {
    return function (cpu) {
        let modRM = this.getModRM(cpu);
        let extension = this.d === 0 && this.w === 1;

        if (modRM.mod === REG_ADDRESSING) {
            let regName = this.getRegName(modRM.rm);
            let immed = cpu.read(this.ip + 2, extension);
            cpu[regName] = compute(cpu, cpu[regName], immed, this.w);
            return 2 + (extension ? 2 : 1);
        }

        let info = this.address(cpu, modRM);
        let value = cpu.read(info.address, this.w);
        let immed = cpu.read(this.ip + 2 + info.size, extension);
        cpu.write(info.address, compute(cpu, value, immed, this.w), this.w);
        return 2 + info.size + (extension ? 2 : 1);
    }
}

/**
 * GROUP 1 Exec
 *
 * @const
 * @type {Object}
 */
const EXEC = {
    // Add Immedate to register/memory
    ADD: generateExec(
            function (cpu, a, b, w) {
                let max = w ? 0xFFFF : 0xFF;
                let res = a + b;
                cpu.setFlag(
                    FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
                    a, b, res, w,
                    'add'
                );
                return res & max;
            }
        ),

    // Sub immedate from register/memory
    SUB: generateExec(
            function (cpu, a, b, w) {
                let res = a - b;
                cpu.setFlag(
                    FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
                    a, b, res, w,
                    'sub'
                );
                return res;
            }
        ),

    // Cmp immedate with register/memory
    CMP: generateExec(
            function (cpu, a, b, w) {
                cpu.setFlag(
                    FLAG_MASK.AF | FLAG_MASK.CF | FLAG_MASK.OF | FLAG_MASK.PF | FLAG_MASK.SF | FLAG_MASK.ZF,
                    a, b, a - b, w,
                    'sub'
                );
                return a;
            }
        )
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
