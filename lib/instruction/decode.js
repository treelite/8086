/**
 * @file instruction decode
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

import './mov';

/**
 * 解析指令
 *
 * @public
 * @param {Object} cpu cpu 对象
 * @return {Object}
 */
export default function (cpu) {
    return new Instruction(cpu);
}
