/**
 * @file MOV
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

/**
 * 寄存器寻址标识
 *
 * @const
 * @type {number}
 */
const REG_ADDRESSING = 3;

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
        return 2 + info.size + (word ? 2 : 1);
    };
}

Instruction.register({

    0xA0: {
        name: 'MOV AL Ob',
        exec: function (cpu) {
            let address = cpu.read(this.ip + 1, true);
            cpu.al = cpu.read(address);
            return 3;
        }
    },

    0xA1: {
        name: 'MOV AX Ov',
        exec: function (cpu) {
            let address = cpu.read(this.ip + 1, true);
            cpu.ax = cpu.read(address, true);
            return 3;
        }
    },

    0xA2: {
        name: 'MOV Ob AL',
        exec: function (cpu) {
            let address = cpu.read(this.ip + 1, true);
            cpu.write(address, cpu.al);
            return 3;
        }
    },

    0xA3: {
        name: 'MOV Ov AX',
        exec: function (cpu) {
            let address = cpu.read(this.ip + 1, true);
            cpu.write(address, cpu.ax, true);
            return 3;
        }
    },

    0xB0: {
        name: 'MOV AL Ib',
        exec: function (cpu) {
            cpu.al = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB1: {
        name: 'MOV CL Ib',
        exec: function (cpu) {
            cpu.cl = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB2: {
        name: 'MOV DL Ib',
        exec: function (cpu) {
            cpu.dl = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB3: {
        name: 'MOV BL Ib',
        exec: function (cpu) {
            cpu.bl = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB4: {
        name: 'MOV AH Ib',
        exec: function (cpu) {
            cpu.ah = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB5: {
        name: 'MOV CH Ib',
        exec: function (cpu) {
            cpu.ch = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB6: {
        name: 'MOV DH Ib',
        exec: function (cpu) {
            cpu.dh = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xB7: {
        name: 'MOV BH Ib',
        exec: function (cpu) {
            cpu.bh = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xBF: {
        name: 'MOV DI Iv',
        exec: function (cpu) {
            cpu.di = cpu.read(this.ip + 1, true);
            return 3;
        }
    },

    0xC6: {
        name: 'MOV Eb Ib',
        exec: movI2E()
    },

    0xC7: {
        name: 'MOV Ev Iv',
        exec: movI2E(true)
    },

    0x88: {
        name: 'MOV Eb Gb',
        exec: movGAndE()
    },

    0x89: {
        name: 'MOV Ev Gv',
        exec: movGAndE(true)
    },

    0x8A: {
        name: 'MOV Gb Eb',
        exec: movGAndE()
    },

    0x8B: {
        name: 'MOV Gv Ev',
        exec: movGAndE(true)
    }

    // TODO
    // 关于段寄存器的选择待确定
    /*
    0x8C: {
        name: 'MOV Ew Sw'
    },

    0x8D: {
        name: 'MOV Sw Ew'
    }
    */

});
