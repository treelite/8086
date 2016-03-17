/**
 * @file GRP 5
 * @author treelite(c.xinle@gmail.com)
 */

import push from './push';

const COMPUTES = ['INC', 'DEC', 'CALL', 'CALL', 'JMP', 'JMP', push.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFF: 'Ev'
    }

};
