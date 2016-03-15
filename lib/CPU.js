/**
 * @file 寄存器
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from 'events';
import decode from './instruction/decode';
import {FLAG_MASK} from './const';

/**
 * 默认的显存基地址
 *
 * @const
 * @type {number}
 */
const VIDE_ADR = 0x8000;

/**
 * 标志位名称
 *
 * @const
 * @type {Array}
 */
const FLAG_NAMES = ['CF', 'AF', 'PF', 'ZF', 'OF', 'SF'];

/**
 * 标示位处理器
 *
 * @type {Object}
 */
let flagHandler = {};

// CF 进位标志
flagHandler[FLAG_MASK.CF] = (cpu, a, b, res, options) => {
    cpu.setPSW(FLAG_MASK.CF, 0);

    let max = options.w ? 0xFFFF : 0xFF;
    if (options.type === 'add' && res > max) {
        cpu.setPSW(FLAG_MASK.CF, 1);
    }
};

// AF 辅助进位标志
flagHandler[FLAG_MASK.AF] = (cpu, a, b, res, options) => {
    cpu.setPSW(FLAG_MASK.AF, false);
    if (options.type === 'add') {
        let max = options.w ? 0xFF : 0x0F;
        let tmp = (a & max) + (b & max);
        if (tmp >= max) {
            cpu.setPSW(FLAG_MASK.AF, true);
        }
    }
};

// SF 符号标志
flagHandler[FLAG_MASK.SF] = (cpu, a, b, res, options) => {
    let mask = options.w ? 0x8000 : 0x80;
    cpu.setPSW(FLAG_MASK.SF, res & mask);
};

// ZF 零标志
flagHandler[FLAG_MASK.ZF] = (cpu, a, b, res, options) => {
    res = res & (options.w ? 0xFFFF : 0xFF);
    cpu.setPSW(FLAG_MASK.ZF, res === 0);
};

// PF 奇偶标志
flagHandler[FLAG_MASK.PF] = (cpu, a, b, res, options) => {
    res = res & 0x01;
    cpu.setPSW(FLAG_MASK.PF, res === 0);
};

// OF 溢出标志
flagHandler[FLAG_MASK.OF] = (cpu, a, b, res, options) => {
    let mask = options.w ? 0xFFFF : 0xFF;
    let hightBit = bits => bits >> (options.w ? 15 : 7);
    res = res & mask;
    if (options.type === 'add') {
        let aH = hightBit(a);
        let bH = hightBit(b);
        let rH = hightBit(res);
        cpu.setPSW(FLAG_MASK.OF, aH === bH && rH !== aH);
    }
};

/**
 * 定义通用寄存器
 *
 * @param {Object} cpu cpu实例
 * @param {string} name 通用寄存器名称
 */
function defineCommonRegister(cpu, name) {
    cpu[name + 'x'] = 0x00;
    Object.defineProperty(
        cpu,
        name + 'h',
        {
            enumerable: true,
            get: () => cpu[name + 'x'] >> 8,
            set: v => cpu[name + 'x'] = (v << 8) + cpu[name + 'l']
        }
    );
    Object.defineProperty(
        cpu,
        name + 'l',
        {
            enumerable: true,
            get: () => cpu[name + 'x'] & 0xFF,
            set: v => cpu[name + 'x'] = (cpu[name + 'h'] << 8) + v
        }
    );
}

/**
 * CPU
 *
 * @class
 * @extends Emitter
 */
class CPU extends EventEmitter {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {Object} memory 内存对象
     * @param {Object=} options 配置项
     * @param {number=} options.videoAddress 显存基地址
     */
    constructor(memory, options = {videoAddress: VIDE_ADR}) {
        super();
        this.memory = memory;
        this.videoAddress = options.videoAddress || VIDE_ADR;

        defineCommonRegister(this, 'a');
        defineCommonRegister(this, 'b');
        defineCommonRegister(this, 'c');
        defineCommonRegister(this, 'd');
    }

    /**
     * Reset
     *
     * @public
     */
    reset() {
        // 指令计数器
        this.ip = 0x00;

        // 通用寄存器
        this.ax = 0x00;
        this.bx = 0x00;
        this.cx = 0x00;
        this.dx = 0x00;

        // 变址寄存器
        // 源变址寄存器
        this.si = 0x00;
        // 目的变址寄存器
        this.di = 0x00;
        // 基址指针寄存器
        this.bp = 0x00;
        // 堆栈指针寄存器
        this.sp = 0x100;

        // 段寄存器
        // 代码段寄存器
        this.cs = 0x00;
        // 数据段寄存器
        this.ds = 0x00;
        // 附加段寄存器
        this.es = 0x00;
        // 堆栈段寄存器
        this.ss = 0x00;

        // 程序状态字
        this.psw = 0x00;

        // 当前执行的指令
        this.instruction = null;
    }

    /**
     * dump
     *
     * @public
     * @return {Object}
     */
    dump() {
        let names = ['ip', 'ax', 'bx', 'cx', 'dx', 'si', 'di', 'bp', 'sp', 'cs', 'ds', 'es', 'ss', 'flags'];
        let res = {};
        for (let name of names) {
            res[name] = this[name];
        }
        return res;
    }

    /**
     * push
     * litte endian
     *
     * @public
     * @param {number} data 16位数据
     */
    push(data) {
        this.memory[--this.sp] = data >> 8;
        this.memory[--this.sp] = data & 0xFF;
    }

    /**
     * pop
     * litte endian
     *
     * @public
     * @return {number}
     */
    pop() {
        let data = this.memory[this.sp++];
        data += this.memory[this.sp++] << 8;
        return data;
    }

    /**
     * 内存写操作
     *
     * @public
     * @param {number} address 内存地址
     * @param {number} data 单字节数据
     * @param {boolean=} word 按字节还是字写入，默认为字节
     */
    write(address, data, word = false) {
        this.memory[address] = data & 0xFF;

        if (word) {
            this.memory[address + 1] = data >> 8;
        }

        if (address >= this.videoAddress) {
            this.emit('writevideo', address - this.videoAddress, data);
        }
    }

    /**
     * 内存读操作
     *
     * @public
     * @param {number} address 内存地址
     * @param {boolean=} word 按字节还是字读取，默认为字节
     * @return {*}
     */
    read(address, word = false) {
        let data = this.memory[address];
        if (word) {
            data += this.memory[address + 1] << 8;
        }
        return data;
    }

    setPSW(flagMask, value) {
        if (value) {
            this.psw |= flagMask;
        }
        else {
            this.psw &= ~flagMask;
        }
    }

    /**
     * 设置 flag
     *
     * @public
     * @param {number} flagSet 需要设置 flag 的集合
     * @param {number} a 操作数1
     * @param {nubmer} b 操作数2
     * @param {number} res 结果
     * @param {number} w 是字节操作还是字操作
     * @param {string=} type 操作类型
     */
    setFlag(flagSet, a, b, res, w, type) {
        for (let key of FLAG_NAMES) {
            let mask =  FLAG_MASK[key];
            if (flagSet & mask) {
                flagHandler[mask](this, a, b, res, {w, type});
            }
        }
    }

    /**
     * 运行
     *
     * @public
     */
    run() {
        while (this.next()) {
            this.emit('cycle');
        }
    }

    /**
     * 单步运行
     *
     * @public
     * @return {boolean} 是否运行成功
     */
    next() {
        let instruction = this.instruction = decode(this);
        if (!instruction.type) {
            return false;
        }

        this.ip += instruction.exec(this);
        return true;
    }
}

export default CPU;
