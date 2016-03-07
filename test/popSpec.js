/**
 * @file POP spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('pop', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('segment registers', () => {
        memory.writeUInt16LE(0x10FF, 0xFE);
        // POP SS
        memory.writeUInt8(0x17, 0);
        cpu.sp = 0xFE;
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.ss).toEqual(0x10FF);
    });

    it('general registers', () => {
        memory.writeUInt16LE(0x10FF, 0xFE);
        // POP BP
        memory.writeUInt8(0x5D, 0);
        cpu.sp = 0xFE;
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.bp).toEqual(0x10FF);
    });

    it('memory', () => {
        memory.writeUInt16LE(0x10FF, 0xFE);
        // PUSH [DI+0x10]
        memory.writeUInt8(0x8F, 0);
        // 0100 0101
        memory.writeUInt8(0x45, 1);
        memory.writeUInt8(0x10, 2);
        cpu.sp = 0xFE;
        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(memory[0x10]).toEqual(0xFF);
        expect(memory[0x11]).toEqual(0x10);
    });

});
