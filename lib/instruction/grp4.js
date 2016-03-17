/**
 * @file GRP 4
 * @author treelite(c.xinle@gmail.com)
 */

import inc from './inc';
import dec from './dec';

const COMPUTES = [inc.compute, dec.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0xFE: 'Eb'
    }

};
