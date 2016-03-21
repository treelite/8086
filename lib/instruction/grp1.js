/**
 * @file GRP 1
 * @author treelite(c.xinle@gmail.com)
 */

import add from './add';
import sub from './sub';
import cmp from './cmp';
import and from './and';
import or from './or';
import xor from './xor';
import adc from './adc';
import sbb from './sbb';

const COMPUTES = [add.compute, or.compute, adc.compute, sbb.compute, and.compute, sub.compute, xor.compute, cmp.compute];

export default {

    beforeExec() {
        let modRM = this.getModRM();
        this.compute = COMPUTES[modRM.reg];
    },

    codes: {
        0x80: 'Eb Ib',
        0x81: 'Ev Iv',
        0x82: 'Eb Ib',
        0x83: 'Ev Ib'
    }

};
