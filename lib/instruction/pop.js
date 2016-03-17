/**
 * @file POP
 * @author treelite(c.xinle@gmail.com)
 */

export default {
    compute() {
        this.dest = this.cpu.pop();
    },

    codes: {
        0x07: 'ES',
        0x17: 'SS',
        0x1F: 'DS',
        0x58: 'AX',
        0x59: 'CX',
        0x5A: 'DX',
        0x5B: 'BX',
        0x5C: 'SP',
        0x5D: 'BP',
        0x5E: 'SI',
        0x5F: 'DI',
        0x8F: 'Ev'
    }
};
