/**
 * @file MOV
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    compute() {
        this.dest = this.source;
    },

    codes: {
        0x88: 'Eb Gb',
        0x89: 'Ev Gv',
        0x8A: 'Gb Eb',
        0x8B: 'Gv Ev',
        0x8C: 'Ew Sw',
        0x8E: 'Sw Ew',
        0xA0: 'AL Ob',
        0xA1: 'AX Ov',
        0xA2: 'Ob AL',
        0xA3: 'Ov AX',
        0xB0: 'AL Ib',
        0xB1: 'CL Ib',
        0xB2: 'DL Ib',
        0xB3: 'BL Ib',
        0xB4: 'AH Ib',
        0xB5: 'CH Ib',
        0xB6: 'DH Ib',
        0xB7: 'BH Ib',
        0xB8: 'AX Iv',
        0xB9: 'CX Iv',
        0xBA: 'DX Iv',
        0xBB: 'BX Iv',
        0xBC: 'SP Iv',
        0xBD: 'BP Iv',
        0xBE: 'SI Iv',
        0xBF: 'DI Iv',
        0xC6: 'Eb Ib',
        0xC7: 'Ev Iv'
    }

};
