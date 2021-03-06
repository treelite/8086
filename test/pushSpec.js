/**
 * @file push spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('push', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('segment registers', () => {
        cpu.es = 0x10FF;
        // PUSH ES
        memory.writeUInt8(0x06, 0);
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(memory[0xFF]).toEqual(0x10);
        expect(memory[0xFE]).toEqual(0xFF);
    });

    it('segment(ds) registers', () => {
        cpu.ds = 0x10FF;
        // PUSH DS
        memory.writeUInt8(0x1E, 0);
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(memory[0xFF]).toEqual(0x10);
        expect(memory[0xFE]).toEqual(0xFF);
    });

    it('general registers', () => {
        cpu.ax = 0x10FE;
        // PUSH AX
        memory.writeUInt8(0x50, 0);
        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(memory[0xFF]).toEqual(0x10);
        expect(memory[0xFE]).toEqual(0xFE);
    });

    it('memory', () => {
        memory.writeUInt16LE(0xFE11, 0x10);

        // PUSH [DI+0x10]
        memory.writeUInt8(0xFF, 0);
        // 0111 0101
        memory.writeUInt8(0x75, 1);
        memory.writeUInt8(0x10, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(memory[0xFF]).toEqual(0xFE);
        expect(memory[0xFE]).toEqual(0x11);
    });

    it('register', () => {
        cpu.bx = 0x1011;
        memory.writeUInt8(0xFF, 0);
        // 11 110 011
        memory.writeUInt8(0xF3, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(memory[0xFF]).toEqual(0x10);
        expect(memory[0xFE]).toEqual(0x11);
    });

});
