/**
 * @file instruction decode
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

import './mov';
import './push';
import './pop';
import './grp1';
import './grp5';
import './xchg';
import './add';
import './sub';
import './cmp';

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
