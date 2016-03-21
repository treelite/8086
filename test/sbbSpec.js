/**
 * @file SBB spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('sbb', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate from accumulator', () => {
        cpu.setPSW(FLAG_MASK.CF, 1);
        cpu.ax = 0x12;

        memory.writeUInt8(0x1D, 0);
        memory.writeUInt16LE(0x11, 1);

        cpu.next();
        expect(cpu.ip).toEqual(3);
        expect(cpu.ax).toEqual(0);

        expect(cpu.getPSW(FLAG_MASK.CF)).toEqual(0);
        expect(cpu.getPSW(FLAG_MASK.ZF)).toEqual(1);
        expect(cpu.getPSW(FLAG_MASK.PF)).toEqual(1);
    });

});
