/**
 * @file Conditional transfers
 * @author treelite(c.xinle@gmail.com)
 */

import CPU from '../lib/CPU';
import {FLAG_MASK} from '../lib/const';

describe('conditional transfers', () => {

    let memory = new Buffer(0x100);
    let cpu = new CPU(memory);

    beforeEach(() => {
        memory.fill(0);
        cpu.reset();
    });

    describe('jb', () => {

        it('jump', () => {
            cpu.setPSW(FLAG_MASK.CF, 1);
            memory.writeUInt8(0x72, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            memory.writeUInt8(0x72, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jz', () => {

        it('jump', () => {
            cpu.setPSW(FLAG_MASK.ZF, 1);
            memory.writeUInt8(0x74, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            memory.writeUInt8(0x74, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jbe', () => {

        it('jump', () => {
            cpu.setPSW(FLAG_MASK.ZF, 1);
            memory.writeUInt8(0x76, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            memory.writeUInt8(0x76, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('js', () => {

        it('jump', () => {
            cpu.setPSW(FLAG_MASK.SF, 1);
            memory.writeUInt8(0x78, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            memory.writeUInt8(0x78, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jnb', () => {

        it('jump', () => {
            memory.writeUInt8(0x73, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            cpu.setPSW(FLAG_MASK.CF, 1);
            memory.writeUInt8(0x73, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jnz', () => {

        it('jump', () => {
            memory.writeUInt8(0x75, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            cpu.setPSW(FLAG_MASK.ZF, 1);
            memory.writeUInt8(0x75, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jnbe', () => {

        it('jump', () => {
            memory.writeUInt8(0x77, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            cpu.setPSW(FLAG_MASK.ZF, 1);
            cpu.setPSW(FLAG_MASK.CF, 1);
            memory.writeUInt8(0x77, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

    describe('jns', () => {

        it('jump', () => {
            memory.writeUInt8(0x79, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x13);
        });

        it('not jump', () => {
            cpu.setPSW(FLAG_MASK.SF, 1);
            memory.writeUInt8(0x79, 0);
            memory.writeUInt8(0x11, 1);

            cpu.next();
            expect(cpu.ip).toEqual(0x2);
        });

    });

});
