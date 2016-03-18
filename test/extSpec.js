/**
 * @file External & no operation
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';

describe('external & no operation', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    it('hlt', () => {
        memory.writeUInt8(0xF4, 0);
        let res = cpu.run();

        expect(res.code).toEqual(0);
    });

    it('nop', () => {
        memory.writeUInt8(0x90, 0);
        cpu.next();

        expect(cpu.ip).toEqual(1);
    });

});
