/**
 * @file 8086 Emulator
 * @author treelite(c.xinle@gmail.com)
 */

import fs from 'fs';

import CPU from './lib/CPU';
import Video from './lib/Video';

/**
 * 8086模拟器
 *
 * @class
 */
class Emulator {

    /**
     * 构造函数
     *
     * @public
     * @constructor
     */
    constructor() {
        let memory = this.memory = new Buffer(2 ^ 16 - 1);
        let cpu = this.cpu = new CPU(memory);
        let video = this.video = new Video();
        cpu.on('writevideo', (address, data) => video.write(address, data));
    }

    /**
     * 加载程序
     *
     * @public
     * @param {string|Buffer} program 程序
     */
    load(program) {
        if (typeof program === 'string') {
            program = fs.readFileSync(program);
        }
        program.copy(this.memory);
        this.cpu.reset();
    }

    /**
     * 运行
     *
     * @public
     */
    run() {
        this.cpu.run();
    }

    /**
     * 单步运行
     *
     * @public
     * @return {*}
     */
    step() {
        return this.cpu.next();
    }

    /**
     * Dump data
     *
     * @public
     * @return {Object}
     */
    dump() {
        let memory = this.memory;
        let dumpMemory = new Buffer(memory.length);
        memory.copy(dumpMemory);

        return {
            register: this.cpu.dump(),
            memory: dumpMemory
        };
    }

}

export default Emulator;
