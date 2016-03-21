/**
 * @file DEC spec
 * @author teeelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('dec', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('memory', () => {
        memory.writeUInt8(0x11, 0xAC);
        memory.writeUInt8(0xFE, 0);
        // 01 001 101
        memory.writeUInt8(0x4D, 1);
        memory.writeUInt8(0xAC, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(memory[0xAC]).toEqual(0x10);
    });

    it('memory (word)', () => {
        memory.writeUInt16LE(0xAE11, 0xAC);
        memory.writeUInt8(0xFF, 0);
        // 01 001 101
        memory.writeUInt8(0x4D, 1);
        memory.writeUInt8(0xAC, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0xAC, true)).toEqual(0xAE10);
    });

    it('register', () => {
        cpu.dx = 0x00;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.dx).toEqual(0xFFFF);
    });

    it('AF === 1', () => {
        cpu.dx = 0x1100;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).not.toEqual(0);
    });

    it('AF === 0', () => {
        cpu.dx = 0x11FE;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).toEqual(0);
    });

    it('OF === 1', () => {
        cpu.dx = 0x8000;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).not.toEqual(0);
    });

    it('OF === 0', () => {
        cpu.dx = 0x8FFF;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).toEqual(0);
    });

    it('PF === 1', () => {
        cpu.dx = 0x04;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.PF).not.toEqual(0);
    });

    it('PF === 0', () => {
        cpu.dx = 0x03;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.PF).toEqual(0);
    });

    it('SF === 1', () => {
        cpu.dx = 0x8104;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.SF).not.toEqual(0);
    });

    it('SF === 0', () => {
        cpu.dx = 0x7104;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.SF).toEqual(0);
    });

    it('ZF === 1', () => {
        cpu.dx = 0x01;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.ZF).not.toEqual(0);
    });

    it('ZF === 0', () => {
        cpu.dx = 0x02;
        memory.writeUInt8(0x4A, 0);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.ZF).toEqual(0);
    });

});
