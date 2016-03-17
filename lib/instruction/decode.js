/**
 * @file instruction decode
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import extend from '../util/extend';
import mov from './mov';
import pop from './pop';
import push from './push';
import xchg from './xchg';
import add from './add';
import sub from './sub';
import cmp from './cmp';
import and from './and';
import or from './or';
import xor from './xor';
import inc from './inc';
import dec from './dec';
import grp1 from './grp1';
import grp4 from './grp4';
import grp5 from './grp5';


/**
 * 指令集合
 *
 * @type {Map}
 */
let instructions = new Map();

/**
 * 注册指令
 *
 * @param {Object} config 指令配置信息
 */
function register(config) {
    let keys = Object.keys(config.codes).map(key => parseInt(key, 10));
    let common = extend({}, config);
    delete common.codes;

    for (let key of keys) {
        let meta = config.codes[key];
        if (typeof meta === 'string') {
            meta = {desc: meta};
        }
        instructions.set(key, extend({}, common, meta));
    }
}

[mov, push, pop, xchg, add, sub, cmp, and, or, xor, inc, dec, grp1, grp4, grp5].forEach(register);

/**
 * 解析指令
 *
 * @public
 * @param {Object} cpu CPU 对象
 * @return {Object}
 */
export default function (cpu) {
    let opCodeByte = cpu.read(cpu.ip);
    let meta = instructions.get(opCodeByte);

    if (!meta) {
        return null;
    }

    return new Instruction(cpu, opCodeByte, meta);
}
