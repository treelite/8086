/**
 * @file instruction decode
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

import './mov';
import './push';
import './pop';
import './grp';

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
