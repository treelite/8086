/**
 * @file cmp spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('cmp', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate with accumulator', () => {
        cpu.al = 0xF1;
        memory.writeUInt8(0x3C, 0);
        memory.writeUInt8(0xF1, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(0xF1);
        expect(cpu.psw & FLAG_MASK.ZF).not.toEqual(0);
    });

    it('immediate with memory', () => {
        memory.writeUInt16LE(0x22, 0xF1);
        memory.writeUInt8(0x81, 0);
        // 01 111 101
        memory.writeUInt8(0x7D, 1);
        memory.writeUInt8(0xF1, 2);
        memory.writeUInt16LE(0x11, 3);

        cpu.next();
        expect(cpu.ip).toEqual(5);
        expect(cpu.psw & FLAG_MASK.ZF).toEqual(0);
    });

    it('register with register', () => {
        cpu.ah = 0xF0;
        cpu.ch = 0xF0;
        memory.writeUInt8(0x38, 0);
        // 11 101 100
        memory.writeUInt8(0xEC, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.psw & FLAG_MASK.ZF).not.toEqual(0);
    });

});
