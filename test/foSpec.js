/**
 * @file Flag Operations
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('flag operations', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('stc', () => {
        memory.writeUInt8(0xF9, 0);

        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.getPSW(FLAG_MASK.CF)).toEqual(1);
    });

    it('stc', () => {
        cpu.setPSW(FLAG_MASK.CF, 1);
        memory.writeUInt8(0xF8, 0);

        cpu.next();
        expect(cpu.ip).toEqual(1);
        expect(cpu.getPSW(FLAG_MASK.CF)).toEqual(0);
    });

});
