/**
 * @file JMP spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('jmp', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('direct within segment', () => {
        cpu.ip = 1;
        memory.writeUInt8(0xE9, 1);
        memory.writeUInt16LE(0x11AB, 2);

        cpu.next();
        expect(cpu.ip).toEqual(0x11AC);
    });

    it('direct within segment-short', () => {
        cpu.ip = 2;
        memory.writeUInt8(0xEB, 2);
        memory.writeUInt8(0x11, 3);

        cpu.next();
        expect(cpu.ip).toEqual(0x13);
    });

    it('indirect within segment by memory', () => {
        memory.writeUInt16LE(0xABCD, 0xAB);
        memory.writeUInt8(0xFF, 0);
        // 01 100 101
        memory.writeUInt8(0x65, 1);
        memory.writeUInt8(0xAB, 2);

        cpu.next();
        expect(cpu.ip).toEqual(0xABCD);
    });

});
