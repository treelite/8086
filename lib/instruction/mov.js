/**
 * @file MOV
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING, REG_ORDER, SEG_REG_ORDER} from '../const';

/**
 * 将立即数存储到寄存器或者内存
 *
 * @param {boolean=} word 按照字节还是字存储 默认为字节
 * @return {Function}
 */
function movI2E(word) {
    return function (cpu) {
        let modRM = this.getModRM(cpu);

        // 寄存器寻址
        // 即直接存储到寄存器
        if (modRM.mod === REG_ADDRESSING) {
            cpu[this.getRegName(modRM.rm)] = cpu.read(this.ip + 2, word);
            return 3;
        }

        // 内存寻址
        let info = this.address(cpu, modRM);
        let immed = cpu.read(this.ip + 2 + info.size, word);
        cpu.write(info.address, immed, word);
        return 2 + info.size + (word ? 2 : 1);
    };
}

/**
 * 寄存器与寄存器或者内存之间的存储
 *
 * @param {boolean=} word 按照字节还是字存储 默认为字节
 * @return {Function}
 */
function movGAndE(word) {
    return function (cpu) {
        let modRM = this.getModRM(cpu);
        let regName = this.getRegName(modRM.reg);

        if (modRM.mod === REG_ADDRESSING) {
            if (this.d === 0) {
                cpu[this.getRegName(modRM.rm)] = cpu[regName];
            }
            else {
                cpu[regName] = cpu[this.getRegName(modRM.rm)];
            }
            return 2;
        }

        let info = this.address(cpu, modRM);
        if (this.d === 0) {
            cpu.write(info.address, cpu[regName], word);
        }
        else {
            cpu[regName] = cpu.read(info.address, word);
        }
        return 2 + info.size;
    };
}

/**
 * 段寄存器与寄存器或者内存之间的存储
 * 指令中的 w 不遵守普通规则
 * w = 0 但操作数都是 word
 *
 * @param {Object} cpu cpu 对象
 * @return {number}
 */
function movSAndE(cpu) {
    let modRM = this.getModRM(cpu);
    let segName = SEG_REG_ORDER[modRM.reg & 3];

    if (modRM.mod === REG_ADDRESSING) {
        // 虽然 w ＝ 0
        // 但寄存器应该为16位
        let regName = REG_ORDER[1][modRM.rm];
        if (this.d === 0) {
            cpu[regName] = cpu[segName];
        }
        else {
            cpu[segName] = cpu[regName];
        }
        return 2;
    }

    let info = this.address(cpu, modRM);
    if (this.d === 0) {
        cpu.write(info.address, cpu[segName], true);
    }
    else {
        cpu[segName] = cpu.read(info.address, true);
    }
    return 2 + info.size;
}

/**
 * 计数寄存器与直接寻址之间的存储
 * 指令中的 d 不遵守普通的规定
 * d = 1 但 实际操作方向是 reg -> memory
 * d = 0 但 实际操锁方向是 memory -> reg
 *
 * @param {number} direct 操作方向
 * @param {number} word byte or word
 * @return {Function}
 */
function movOAndA(direct, word = 0) {
    let regName = REG_ORDER[word][0];
    return function (cpu) {
        let address = cpu.read(this.ip + 1, true);
        if (direct) {
            cpu[regName] = cpu.read(address, word);
        }
        else {
            cpu.write(address, cpu[regName], word);
        }
        return 3;
    };
}

let instructions = {

    0xA0: {
        desc: 'AL Ob',
        exec: movOAndA(1)
    },

    0xA1: {
        desc: 'AX Ov',
        exec: movOAndA(1, 1)
    },

    0xA2: {
        desc: 'Ob AL',
        exec: movOAndA(0)
    },

    0xA3: {
        desc: 'Ov AX',
        exec: movOAndA(0, 1)
    },

    0xC6: {
        desc: 'Eb Ib',
        exec: movI2E()
    },

    0xC7: {
        desc: 'Ev Iv',
        exec: movI2E(true)
    },

    0x88: {
        desc: 'Eb Gb',
        exec: movGAndE()
    },

    0x89: {
        desc: 'Ev Gv',
        exec: movGAndE(true)
    },

    0x8A: {
        desc: 'Gb Eb',
        exec: movGAndE()
    },

    0x8B: {
        desc: 'Gv Ev',
        exec: movGAndE(true)
    },

    0x8C: {
        desc: 'Ew Sw',
        exec: movSAndE
    },

    0x8E: {
        desc: 'Sw Ew',
        exec: movSAndE
    }
};

// Immedate to register
for (let i = 0; i <= 15; i++) {
    let reg = i & 7;
    let w = i >> 3;
    let regName = REG_ORDER[w][reg];
    instructions[i + 0xB0] = {
        desc: `${regName.toUpperCase()} I` + (w ? 'v' : 'b'),
        exec: function (cpu) {
            cpu[regName] = cpu.read(this.ip + 1, w);
            return w ? 3 : 2;
        }
    };

}

Instruction.register('mov', instructions);
