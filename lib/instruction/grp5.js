/**
 * @file GRP 5
 * @author treelite(c.xinle@gmail.com)
 */

import push from './push';
import inc from './inc';
import dec from './dec';

/**
 * Indirect within segment
 *
 * @return {number} new ip
 */
function compute4Call() {
    let cpu = this.cpu;
    cpu.push(cpu.ip + this.size);
    return this.dest;
}

// TODO
// 暂时未实现段之间的 CALL 与 JMP
const COMPUTES = [inc.compute, dec.compute, compute4Call, null, 'JMP', 'JMP', push.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFF: 'Ev'
    }

};
