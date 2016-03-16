/**
 * @file OR spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('or', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate to accumulator', () => {
        cpu.setPSW(FLAG_MASK.OF, 1);
        cpu.setPSW(FLAG_MASK.CF, 1);
        cpu.setPSW(FLAG_MASK.AF, 1);

        cpu.al = 0x82;
        memory.writeUInt8(0x0C, 0);
        memory.writeUInt8(0x90, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(0x82 | 0x90);
        expect(cpu.psw & FLAG_MASK.OF).toEqual(0);
        expect(cpu.psw & FLAG_MASK.CF).toEqual(0);
        expect(cpu.psw & FLAG_MASK.AF).not.toEqual(0);
        expect(cpu.psw & FLAG_MASK.SF).not.toEqual(0);
        expect(cpu.psw & FLAG_MASK.ZF).toEqual(0);
        expect(cpu.psw & FLAG_MASK.PF).not.toEqual(0);
    });

    it('register to memory', () => {
        cpu.al = 0xAB;
        memory.writeUInt8(0x11, 0x10);
        memory.writeUInt8(0x08, 0);
        // 01 000 100
        memory.writeUInt8(0x44, 1);
        memory.writeUInt8(0x10, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0x10)).toEqual(0xAB | 0x11);
    });

    it('immediate to memory', () => {
        memory.writeUInt16LE(0x11FF, 0x10);
        memory.writeUInt8(0x83, 0);
        // 00 001 110
        memory.writeUInt8(0x0E, 1);
        memory.writeUInt16LE(0x10, 2);
        memory.writeUInt8(0x11, 4);

        cpu.next();
        expect(cpu.ip).toEqual(5);
        expect(cpu.read(0x10, true)).toEqual(0x11FF | 0x11);
    });

});
