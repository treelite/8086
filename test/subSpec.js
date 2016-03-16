/**
 * @file sub spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('sub', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate from accumulator', () => {
        cpu.al = 0xFF;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(0xFE);
    });

    it('immediate from accumulator (word)', () => {
        cpu.ax = 0xFF;
        memory.writeUInt8(0x2D, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.ax).toEqual(0xFE);
    });

    it('reg from register', () => {
        cpu.bx = 0xFF;
        cpu.cx = 0xFF;
        memory.writeUInt8(0x2B, 0);
        // 11 011 001
        memory.writeUInt8(0xD9, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.cx).toEqual(0xFF);
        expect(cpu.bx).toEqual(0);
    });

    it('register from memory', () => {
        cpu.bl = 0x31;
        memory.writeUInt8(0x11, 0xF1);
        memory.writeUInt8(0x28, 0);
        // 10 011 101
        memory.writeUInt8(0x9D, 1);
        memory.writeUInt16LE(0xF1, 2);

        cpu.next();
        expect(cpu.ip).toEqual(4);
        expect(memory[0xF1]).toEqual(0xE0);
    });

    it('immediate from memory', () => {
        memory.writeUInt8(0x21, 0xF1);
        memory.writeUInt8(0x80, 0);
        // 01 101 101
        memory.writeUInt8(0x6D, 1);
        memory.writeUInt8(0xF1, 2);
        memory.writeUInt8(0x11, 3);

        cpu.next();
        expect(cpu.ip).toEqual(4);
        expect(memory[0xF1]).toEqual(0x10);
    });

    it('CF === 1', () => {
        cpu.al = 0x11;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x22, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.CF).not.toEqual(0);
    });

    it('CF === 0', () => {
        cpu.al = 0x31;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x22, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.CF).toEqual(0);
    });

    it('AF === 1', () => {
        cpu.al = 0x31;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x22, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).not.toEqual(0);
    });

    it('AF === 0', () => {
        cpu.al = 0x31;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x21, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).toEqual(0);
    });

    it('OF === 1', () => {
        cpu.al = 0x71;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0xF1, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).not.toEqual(0);
    });

    it('OF === 1', () => {
        cpu.al = 0x71;
        memory.writeUInt8(0x2C, 0);
        memory.writeUInt8(0x61, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).toEqual(0);
    });

});
