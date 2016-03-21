/**
 * @file CPU
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from 'events';
import extend from './util/extend';
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
 * 运行状态
 *
 * @const
 * @type {Object}
 */
const STATE = {
    RUN: 0,
    HLT: 1
};

/**
 * 标示位处理器
 *
 * @type {Object}
 */
let flagHandlers = {};

// CF 进位/借位标志
flagHandlers[FLAG_MASK.CF] = (cpu, a, b, res, options) => {
    cpu.setPSW(FLAG_MASK.CF, false);

    let max = options.w ? 0xFFFF : 0xFF;
    if (options.type === 'add' && res > max) {
        cpu.setPSW(FLAG_MASK.CF, true);
    }
    else if (options.type === 'sub' && a < b) {
        cpu.setPSW(FLAG_MASK.CF, true);
    }
};

// AF 辅助进位标志
flagHandlers[FLAG_MASK.AF] = (cpu, a, b, res, options) => {
    cpu.setPSW(FLAG_MASK.AF, false);
    let max = options.w ? 0xFF : 0x0F;
    if (options.type === 'add') {
        let tmp = (a & max) + (b & max);
        if (tmp > max) {
            cpu.setPSW(FLAG_MASK.AF, true);
        }
    }
    else if (options.type === 'sub' && (a & max) < (b & max)) {
        cpu.setPSW(FLAG_MASK.AF, true);
    }
};

// SF 符号标志
flagHandlers[FLAG_MASK.SF] = (cpu, a, b, res, options) => {
    let mask = options.w ? 0x8000 : 0x80;
    cpu.setPSW(FLAG_MASK.SF, res & mask);
};

// ZF 零标志
flagHandlers[FLAG_MASK.ZF] = (cpu, a, b, res, options) => {
    cpu.setPSW(FLAG_MASK.ZF, res === 0);
};

// PF 奇偶标志
flagHandlers[FLAG_MASK.PF] = (cpu, a, b, res, options) => {
    let str = res.toString(2);
    let n = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        if (str.charAt(i) === '1') {
            n++;
        }
    }
    cpu.setPSW(FLAG_MASK.PF, n % 2 === 0);
};

// OF 溢出标志
flagHandlers[FLAG_MASK.OF] = (cpu, a, b, res, options) => {
    let mask = options.w ? 0xFFFF : 0xFF;
    let hightBit = bits => bits >> (options.w ? 15 : 7);
    res = res & mask;
    let aH = hightBit(a);
    let bH = hightBit(b);
    let rH = hightBit(res);
    cpu.setPSW(FLAG_MASK.OF, false);
    if (options.type === 'add' && aH === bH && rH !== aH) {
        cpu.setPSW(FLAG_MASK.OF, true);
    }
    else if (options.type === 'sub' && aH !== bH && aH !== rH) {
        cpu.setPSW(FLAG_MASK.OF, true);
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

    /**
     * 设置状态字
     *
     * @public
     * @param {number} flagMask flag mask
     * @param {number} value value
     */
    setPSW(flagMask, value) {
        if (value) {
            this.psw |= flagMask;
        }
        else {
            this.psw &= ~flagMask;
        }
    }

    /**
     * 获取状态字
     *
     * @public
     * @param {number} flagMask flag mask
     * @return {number}
     */
    getPSW(flagMask) {
        return this.psw & flagMask;
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
                flagHandlers[mask](this, a, b, res, {w, type});
            }
        }
    }

    /**
     * 运行
     *
     * @public
     * @return {Object}
     */
    run() {
        this.state = STATE.RUN;
        this.exitMsg = null;
        while (this.state !== STATE.HLT) {
            this.next();
            this.emit('cycle');
        }
        return this.exitMsg;
    }

    /**
     * 停机
     *
     * @public
     * @param {Object} e halt info
     * @param {number} e.code code
     * @param {string=} e.msg message
     */
    hlt(e) {
        let info = {
            ip: this.ip,
            opCodeByte: this.read(this.ip)
        };
        this.exitMsg = extend(info, e);
        this.state = STATE.HLT;
    }

    /**
     * 单步运行
     *
     * @public
     */
    next() {
        let instruction = this.instruction = decode(this);
        if (!instruction) {
            return this.hlt({
                code: 1,
                msg: 'unknow instruction'
            });
        }

        this.ip = instruction.exec() & 0xFFFF;
    }
}

export default CPU;
