/**
 * @file Operand
 * @author treelite(c.xinle@gmail.com)
 */

import {REG_ADDRESSING, SEG_REG_ORDER} from '../const';

/**
 * 操作数解析函数集合
 *
 * @type {Object}
 */
let parseHandlers = {};

// Register
parseHandlers.G = (cpu, inst, desc, modRM) => {
    let regName = inst.getRegName(modRM.reg);
    return {
        descriptor: {
            get() {
                return cpu[regName];
            },
            set(value) {
                cpu[regName] = value;
            }
        },
        size: 1
    };
};

// Register/memory
parseHandlers.E = (cpu, inst, desc, modRM) => {
    let size;
    let descriptor;
    // MOV Ew Sw 中 opCodeByte.w  === 0
    // 但寄存器应该为字
    let w = desc.charAt(1) === 'w' ? 1 : inst.w;

    if (modRM.mod === REG_ADDRESSING) {
        let regName = inst.getRegName(modRM.rm, w);
        descriptor = {
            get: function () {
                return cpu[regName];
            },
            set: function (value) {
                cpu[regName] = value;
            }
        };
        size = 1;
    }
    else {
        let info = inst.address();
        descriptor = {
            get: function () {
                return cpu.read(info.address, w);
            },
            set: function (value) {
                cpu.write(info.address, value, w);
            }
        };
        size = 1 + info.size;
    }

    return {size, descriptor};
};

// Immediate
parseHandlers.I = (cpu, inst, desc, modRM, offset) => {
    // GRP1 中的立即数不完全遵守 opCodeByte.w
    // 所以直接使用 desc 中的描述
    // FIXME
    // 暂时不考虑 Io 的情况
    // 只支持 Ib 与 Iv
    let w = desc.charAt(1) === 'v';
    return {
        descriptor: {
            get() {
                return cpu.read(cpu.ip + 1 + offset, w);
            }
        },
        size: offset + (w ? 2 : 1)
    };
};

// Direct addressing
parseHandlers.O = (cpu, inst) => {
    // 直接寻址的地址都是16位的
    let address = cpu.read(cpu.ip + 1, 2);
    return {
        descriptor: {
            get() {
                return cpu.read(address, inst.w);
            },
            set(value) {
                cpu.write(address, value, inst.w);
            }
        },
        size: 2
    };
};

// Segment register
parseHandlers.S = (cpu, inst, desc, modRM) => {
    let segName = SEG_REG_ORDER[modRM.reg];
    return {
        descriptor: {
            get() {
                return cpu[segName];
            },
            set(value) {
                cpu[segName] = value;
            }
        },
        size: 1
    };
};

/**
 * 解析操作数
 *
 * @public
 * @param {Object} inst 指令对象
 * @param {string} name 操作数名称 dest / source
 * @param {string} desc 操作数描述
 * @param {number=} offset 操作数在指令中的字节偏移数
 * @return {*}
 */
export function parse(inst, name, desc, offset = 0) {
    let size = 0;
    let descriptor;
    let cpu = inst.cpu;

    // 特定寄存器操作数
    // reg 被编码到 opCodeByte 中
    // opCodeByte.w 位不再生效
    // 需要更具寄存器来确定操作数的字节数
    if (cpu.hasOwnProperty(desc.toLowerCase())) {
        let regName = desc.toLowerCase();
        inst.w = regName.charAt(1) !== 'h' && regName.charAt(1) !== 'l' ? 1 : 0;
        descriptor = {
            get() {
                return cpu[regName];
            },
            set(value) {
                cpu[regName] = value;
            }
        };
    }
    else {
        let handler = parseHandlers[desc.charAt(0)];
        if (!handler) {
            throw new Error('can not parse operand: ' + desc);
        }

        let modRM = inst.getModRM();
        let res = handler(cpu, inst, desc, modRM, offset);
        size = res.size;
        descriptor = res.descriptor;
    }

    if (descriptor) {
        Object.defineProperty(inst, name, descriptor);
    }

    return size;
}
