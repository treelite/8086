/**
 * @file Add spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('add', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate to accumulator', () => {
        cpu.al = 0x22;
        // Add al 0x12
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x12, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(0x34);
    });

    it('immediate to accumulator (word)', () => {
        cpu.ax = 0x22FE;
        // Add ax 0x12
        memory.writeUInt8(0x05, 0);
        memory.writeUInt16LE(0x1201, 1);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.ax).toEqual(0x34FF);
    });

    it('register to register', () => {
        cpu.bl = 0x31;
        cpu.cl = 0x11;
        // Add cl bl
        memory.writeUInt8(0x02, 0);
        // 11 001 011
        memory.writeUInt8(0xCB, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.cl).toEqual(0x42);
        expect(cpu.bl).toEqual(0x31);
    });

    it('memory to register', () => {
        cpu.cx = 0x1101;
        memory.writeUInt16LE(0x2222, 0x10);
        memory.writeUInt8(0x03, 0);
        // 01 001 101
        memory.writeUInt8(0x4D, 1);
        memory.writeUInt8(0x10, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.cx).toEqual(0x3323);
    });

    it('register to memory', () => {
        cpu.al = 0xAB;
        memory.writeUInt8(0x11, 0x10);
        memory.writeUInt8(0x00, 0);
        // 01 000 100
        memory.writeUInt8(0x44, 1);
        memory.writeUInt8(0x10, 2);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.read(0x10)).toEqual(0xBC);
    });

    it('immediate to register', () => {
        cpu.bx = 0x11AB;
        memory.writeUInt8(0x81, 0);
        // 11 000 011
        memory.writeUInt8(0xC3, 1);
        memory.writeUInt16LE(0x1111, 2);

        cpu.next();
        expect(cpu.ip).toEqual(4);
        expect(cpu.bx).toEqual(0x22BC);
    });

    it('immediate to memory', () => {
        memory.writeUInt16LE(0x11FF, 0x10);
        memory.writeUInt8(0x83, 0);
        // 00 000 110
        memory.writeUInt8(0x06, 1);
        memory.writeUInt16LE(0x10, 2);
        memory.writeUInt8(0x11, 4);

        cpu.next();
        expect(cpu.ip).toEqual(5);
        expect(cpu.read(0x10, true)).toEqual(0x1210);
    });

    it('CF === 1', () => {
        cpu.ax = 0xFFFF;
        memory.writeUInt8(0x05, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.CF).not.toEqual(0);
    });

    it('CF === 0', () => {
        cpu.al = 0x0F;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.CF).toEqual(0);
    });

    it('AF === 1', () => {
        cpu.al = 0x0F;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).not.toEqual(0);
    });

    it('AF === 0', () => {
        cpu.ax = 0xFF01;
        memory.writeUInt8(0x05, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.AF).toEqual(0);
    });

    it('OF === 1', () => {
        cpu.al = 0x7F;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).not.toEqual(0);
    });

    it('OF === 0', () => {
        cpu.ax = 0x7F;
        memory.writeUInt8(0x05, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.OF).toEqual(0);
    });

    it('ZF === 0', () => {
        cpu.al = 0xEF;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.ZF).toEqual(0);
    });

    it('ZF === 0', () => {
        cpu.al = 0xFF;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.ZF).toEqual(0);
    });

    it('SF === 1', () => {
        cpu.al = 0xFE;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.SF).not.toEqual(0);
    });

    it('SF === 0', () => {
        cpu.ax = 0x7E;
        memory.writeUInt8(0x05, 0);
        memory.writeUInt16LE(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.SF).toEqual(0);
    });

    it('PF === 1', () => {
        cpu.al = 0x02;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.PF).not.toEqual(0);
    });

    it('PF === 0', () => {
        cpu.al = 0x07;
        memory.writeUInt8(0x04, 0);
        memory.writeUInt8(0x01, 1);

        cpu.next();
        expect(cpu.psw & FLAG_MASK.PF).toEqual(0);
    });

});
