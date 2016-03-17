/**
 * @file CALL spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('add', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('direct within segment', () => {
        memory.writeUInt8(0xE8, 0);
        memory.writeUInt16LE(0xEA, 1);

        cpu.next();
        expect(cpu.ip).toEqual(0xEA + 3);
        // check stack
        // should save the next ip
        expect(memory[cpu.sp]).toEqual(3);
    });

    it('indirect within segment by memory', () => {
        memory.writeUInt16LE(0x22, 0xAB);
        memory.writeUInt8(0xFF, 0);
        // 10 010 101
        memory.writeUInt8(0x95, 1);
        memory.writeUInt16LE(0xAB, 2);

        cpu.next();
        expect(cpu.ip).toEqual(0x22);
        expect(memory[cpu.sp]).toEqual(4);
    });

    it('indirect within segment by register', () => {
        cpu.bx = 0xAB;
        memory.writeUInt8(0xFF, 0);
        // 11 010 011
        memory.writeUInt8(0xD3, 1);

        cpu.next();
        expect(cpu.ip).toEqual(0xAB);
        expect(memory[cpu.sp]).toEqual(2);
    });

});
