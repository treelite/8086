/**
 * @file HLT
 * @author treelite(c.xinle@gmail.com)
 */

export default {
    compute() {
        this.cpu.hlt({code: 0});
    },

    codes: {
        0xF4: ''
    }
};
