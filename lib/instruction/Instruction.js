/**
 * @file 指令对象
 * @author treelite(c.xinle@gmail.com)
 */

let instructions = new Map();

/**
 * 寄存器编号
 *
 * @const
 * @type {Array}
 */
const REG = [
    ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'],
    ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di']
];

export default class {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {Object} cpu cpu对象
     */
    constructor(cpu) {
        let ip = this.ip = cpu.ip;
        let opCodeByte = cpu.read(ip);
        let meta = instructions.get(opCodeByte);
        if (!meta) {
            return null;
        }
        this.name = meta.name;
        this.exec = meta.exec;

        this.opCode = opCodeByte >> 2;
        this.d = (opCodeByte & 2) >> 1;
        this.w = opCodeByte & 1;

        // 如果是 GROUP 指令
        // 添加具体的子指令名称
        if (meta.getSubName) {
            this.getSubName = meta.getSubName;
            this.name += ' - ' + this.getSubName(cpu);
        }
    }

    /**
     * 解析 ModRM
     *
     * @public
     * @param {number} modeByte ModRM字节数据
     * @return {Object}
     */
    getModRM(modeByte) {
        return {
            mod: modeByte >> 6,
            reg: (modeByte >> 3) & 7,
            rm: modeByte & 7
        }
    }

    /**
     * 获取寄存器名称
     *
     * @public
     * @param {number} reg 寄存器编号
     * @return {string}
     */
    getRegName(reg) {
        return REG[this.w][reg];
    }

    /**
     * 内存寻址
     *
     * @public
     * @param {Object} cpu cpu 对象
     * @param {Object} modRM ModRM 信息
     * @return {number}
     */
    address(cpu, modRM) {
        let ip = this.ip;
        let address;
        switch (modRM.rm) {
            case 0:
                address = cpu.bx + cpu.si;
                break;
            case 1:
                address = cpu.bx + cpu.di;
                break;
            case 2:
                address = cpu.bp + si;
                break;
            case 3:
                address = cpu.bp + di;
                break;
            case 4:
                address = cpu.si;
                break;
            case 5:
                address = cpu.di;
                break;
            case 6:
                // 后面再处理直接寻址的情况
                address = cpu.bp;
                break;
            case 7:
                address = cpu.bx;
                break;
        }

        let size = 0;

        // 特殊处理直接寻址
        // MOD = 00 & R/M = 110
        if (modRM.mod === 0 && modRM.rm == 6) {
            address = cpu.read(ip + 2);
            size++;
            if (this.d === 1) {
                address += cpu.read(ip + 3) << 8;
                size++;
            }
        }

        if (modRM.mod >= 1) {
            address += cpu.read(ip + 2);
            size++;
        }
        if (modRM.mod == 2) {
            address += cpu.read(ip + 3) << 8;
            size++;
        }

        return {address, size};
    }


    /**
     * 指令注册
     *
     * @static
     * @param {Object} obj 指令集
     */
    static register(obj) {
        Object.keys(obj).forEach(code => instructions.set(parseInt(code, 10), obj[code]));
    }

}
