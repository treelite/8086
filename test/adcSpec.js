/**
 * @file ADC spec
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('adc', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('immediate to accumulator', () => {
        cpu.setPSW(FLAG_MASK.CF, 1);
        cpu.al = 0xEE;

        memory.writeUInt8(0x14, 0);
        memory.writeUInt8(0x11, 1);

        cpu.next();
        expect(cpu.ip).toEqual(2);
        expect(cpu.al).toEqual(0);

        expect(cpu.getPSW(FLAG_MASK.CF)).toEqual(1);
        expect(cpu.getPSW(FLAG_MASK.ZF)).toEqual(0);
        expect(cpu.getPSW(FLAG_MASK.PF)).toEqual(0);
    });

});
