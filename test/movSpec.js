/**
 * @file MOV spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('mov', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('register to register', () => {
        cpu.bl = 10;
        // MOV AL BL
        memory.writeUInt8(0x8A, 0);
        // 1100 0011
        memory.writeUInt8(0xC3, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(10);
        expect(cpu.bl).toEqual(10);
    });

    it('memory from register', () => {
        cpu.ax = 0x10FF;
        // MOV [DI+D8] AX
        memory.writeUInt8(0x89, 0);
        // 0100 0101
        memory.writeUInt8(0x45, 1);
        memory.writeUInt8(0x20, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0x20, true)).toEqual(0x10FF);
    });

    it('immediate to register', () => {
        memory.writeUInt8(0xC6, 0);
        // 1100 0001
        memory.writeUInt8(0xC1, 1);
        memory.writeUInt8(0xEF, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.cl).toEqual(0xEF);
    });

    it('immediate to memory', () => {
        memory.writeUInt8(0xC7, 0);
        // 0000 0110
        memory.writeUInt8(0x06, 1);
        memory.writeUInt8(0xEF, 2);
        memory.writeUInt16LE(0x11AB, 4);

        cpu.next();
        expect(cpu.ip).toEqual(6);
        expect(cpu.read(0xEF, true)).toEqual(0x11AB);
    });

    it('immediate to cx', () => {
        memory.writeUInt8(0xB9, 0);
        memory.writeUInt16LE(0x2040, 1);
        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.cx).toEqual(0x2040);
    });

    it('memory to accumulator', () => {
        memory.writeUInt8(0xA0, 0);
        memory.writeUInt8(0xE0, 1);
        memory.writeUInt8(0x12, 0xE0);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.al).toEqual(0x12);
    });

    it('accumulator to memory', () => {
        cpu.ax = 0xEFAB;
        memory.writeUInt8(0xA3, 0);
        memory.writeUInt8(0xE0, 1);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0xE0, true)).toEqual(0xEFAB);
    });

    it('register to segment register', () => {
        cpu.ax = 0xEFAB;
        // MOV SS AX
        memory.writeUInt8(0x8E, 0);
        // 1101 0000
        memory.writeUInt8(0xD0, 1);
        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.ss).toEqual(0xEFAB);
    });

    it('segment register to memory', () => {
        cpu.ds = 0xFEAA;
        // MOV [DI+D8] ds
        memory.writeUInt8(0x8C, 0);
        // 0101 1101
        memory.writeUInt8(0x5C, 1);
        memory.writeUInt8(0xCB, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0xCB, true)).toEqual(0xFEAA);
    });
});
