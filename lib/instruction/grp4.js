/**
 * @file GRP 4
 * @author treelite(c.xinle@gmail.com)
 */

import inc from './inc';

const COMPUTES = [inc.compute, 'DEC'];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFE: 'Eb'
    }

};
