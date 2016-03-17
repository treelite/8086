/**
 * @file XCHG
 * @author treelite(c.xinle@gmail.com)
 */

export default {
    compute() {
        let tmp = this.source;
        this.source = this.dest;
        this.dest = tmp;
    },
    codes: {
        0x86: 'Gb Eb',
        0x87: 'Gv Ev',
        0x91: 'CX AX',
        0x92: 'DX AX',
        0x93: 'BX AX',
        0x94: 'SP AX',
        0x95: 'BP AX',
        0x96: 'SI AX',
        0x97: 'DI AX'
    }
};
