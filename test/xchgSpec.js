/**
 * @file XCHG
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('xchg', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('register with accumulator', () => {
        cpu.ax = 1;
        cpu.bx = 2;
        memory.writeUInt8(0x93);
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.ax).toEqual(2);
        expect(cpu.bx).toEqual(1);
    });

    it('register or memory with register', () => {
        cpu.al = 1;
        memory.writeUInt8(10, 0x88);

        memory.writeUInt8(0x86, 0);
        // 1000 0101
        memory.writeUInt8(0x85, 1);
        memory.writeUInt8(0x88, 2);
        cpu.next();
        expect(cpu.ip).toEqual(4);
        expect(cpu.al).toEqual(10);
        expect(cpu.read(0x88)).toEqual(1);
    });

    it('register or memory with register (word)', () => {
        cpu.ax = 0x10FF;
        memory.writeUInt8(10, 0x88);

        memory.writeUInt8(0x87, 0);
        // 0100 0101
        memory.writeUInt8(0x45, 1);
        memory.writeUInt8(0x88, 2);
        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.ax).toEqual(10);
        expect(cpu.read(0x88, true)).toEqual(0x10FF);
    });
});
