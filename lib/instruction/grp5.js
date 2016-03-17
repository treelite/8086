/**
 * @file GRP 5
 * @author treelite(c.xinle@gmail.com)
 */

import push from './push';
import inc from './inc';
import dec from './dec';

const COMPUTES = [inc.compute, dec.compute, 'CALL', 'CALL', 'JMP', 'JMP', push.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFF: 'Ev'
    }

};
