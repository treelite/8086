/**
 * @file PUSH
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    compute() {
        this.cpu.push(this.dest);
    },

    codes: {
        0x06: 'ES',
        0x0E: 'CS',
        0x16: 'SS',
        0x1E: 'DS',
        0x50: 'AX',
        0x51: 'CX',
        0x52: 'DX',
        0x53: 'BX',
        0x54: 'SP',
        0x55: 'BP',
        0x56: 'SI',
        0x57: 'DI'
    }
};
