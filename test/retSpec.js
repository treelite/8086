/**
 * @file RET spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('ret', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('within segment', () => {
        cpu.push(0xAB);
        memory.writeUInt8(0xC3);

        cpu.next();
        expect(cpu.ip).toEqual(0xAB);
    });

    it('within segment adding immed to SP', () => {
        cpu.push(0x22);
        cpu.push(0x33);
        cpu.push(0xAB);

        memory.writeUInt8(0xC2, 0);
        memory.writeUInt16LE(0x02, 1);

        cpu.next();
        expect(cpu.ip).toEqual(0xAB);
        expect(memory[cpu.sp]).toEqual(0x22);
    });
});
