/**
 * @file 指令对象
 * @author treelite(c.xinle@gmail.com)
 */

import {parse} from './operand';
import extend from '../util/extend';
import {REG_ORDER} from '../const';

export default class {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     * @param {Object} cpu cpu对象
     * @param {number} opCodeByte 操作码
     * @param {Object} meta 元数据
     */
    constructor(cpu, opCodeByte, meta) {
        extend(this, meta);
        this.cpu = cpu;
        this.ip = cpu.ip;
        this.opCodeByte = opCodeByte;
        this.opCode = opCodeByte >> 2;
        this.d = (opCodeByte & 2) >> 1;
        this.w = opCodeByte & 1;
        this.size = 1;

        // 根据操作数描述解析操作数
        if (this.desc) {
            let [dest, source] = this.desc.split(' ');
            let size = parse(this, 'dest', dest);
            if (source) {
                size = Math.max(parse(this, 'source', source, size), size);
                // 由于操作数的字节数不一致，字节数少的操作数需要高位补齐
                // 但是不能简单的直接高位全补零，得考虑符号位，不然要悲剧：
                // 0xFF -> 0x00FF ，-1 在高位直接补 0 后 就成了 255 ...
                if (this.desc === 'Ev Ib' && this.source >> 7 === 1) {
                    this.source |= 0xFF00;
                }
            }
            this.size += size;
        }
    }

    /**
     * 执行指令
     *
     * @public
     * @return {number} 下一条指令的地址
     */
    exec() {
        // 执行存在的前置操作
        // 一般用于 GRP 指令修改实际 compute 函数
        if (this.beforeExec) {
            this.beforeExec();
        }

        let ip = this.compute();
        if (ip === undefined) {
            ip = this.cpu.ip + this.size;
        }
        return ip;
    }

    /**
     * 解析 ModRM
     *
     * @public
     * @return {Object}
     */
    getModRM() {
        let cpu = this.cpu;
        let modeByte = cpu.read(cpu.ip + 1);
        return {
            mod: modeByte >> 6,
            reg: (modeByte >> 3) & 7,
            rm: modeByte & 7
        };
    }

    /**
     * 获取寄存器名称
     *
     * @public
     * @param {number} reg 寄存器编号
     * @param {number=} w 字节还是字
     * @return {string}
     */
    getRegName(reg, w) {
        if (arguments.length < 2) {
            w = this.w;
        }
        return REG_ORDER[w][reg];
    }

    /**
     * 内存寻址
     *
     * @public
     * @param {Object=} modRM ModRM 信息
     * @return {Object}
     */
    address(modRM) {
        let cpu = this.cpu;
        let ip = cpu.ip;
        let address;
        modRM = modRM || this.getModRM();
        switch (modRM.rm) {
            case 0:
                address = cpu.bx + cpu.si;
                break;
            case 1:
                address = cpu.bx + cpu.di;
                break;
            case 2:
                address = cpu.bp + cpu.si;
                break;
            case 3:
                address = cpu.bp + cpu.di;
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

        // 寻址指令长度
        let size = 0;

        // 特殊处理直接寻址
        // MOD = 00 & R/M = 110
        // 有效地址(Effective address) 是16位
        if (modRM.mod === 0 && modRM.rm === 6) {
            address = cpu.read(ip + 2, true);
            size += 2;
        }

        if (modRM.mod >= 1) {
            address += cpu.read(ip + 2);
            size++;
        }
        if (modRM.mod === 2) {
            address += cpu.read(ip + 3) << 8;
            size++;
        }

        return {address, size};
    }

}
