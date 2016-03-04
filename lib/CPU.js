/**
 * @file 寄存器
 * @author treelite(c.xinle@gmail.com)
 */

import EventEmitter from 'events';
import decode from './instruction/decode';

/**
 * 默认的显存基地址
 *
 * @const
 * @type {number}
 */
const VIDE_ADR = 0x8000;

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
        this.sp = 0x00;

        // 段寄存器
        // 代码段寄存器
        this.cs = 0x00;
        // 数据段寄存器
        this.ds = 0x00;
        // 附加段寄存器
        this.es = 0x00;
        // 堆栈段寄存器
        this.ss = 0x00;

        // 标志寄存器
        this.flags = 0x00;

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
     * 内存写操作
     *
     * @public
     * @param {number} address 内存地址
     * @param {number} data 单字节数据
     */
    write(address, data) {
        this.memory[address] = data;
        if (address >= this.videoAddress) {
            this.emit('writevideo', address - this.videoAddress, data);
        }
    }

    /**
     * 内存读操作
     *
     * @public
     * @param {number} address 内存地址
     * @return {*}
     */
    read(address) {
        return this.memory[address];
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
        if (!instruction.name) {
            return false;
        }

        this.ip += instruction.exec(this);
        return true;
    }
}

export default CPU;
