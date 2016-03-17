/**
 * @file GRP 5
 * @author treelite(c.xinle@gmail.com)
 */

import push from './push';
import inc from './inc';
import dec from './dec';
import call from './call';
import jmp from './jmp';

// TODO
// 暂时未实现段之间的 CALL 与 JMP
const COMPUTES = [inc.compute, dec.compute, call.compute, 'CALL', jmp.compute, 'JMP', push.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFF: 'Ev'
    }

};
