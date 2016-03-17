/**
 * @file RET
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    compute() {
        let cpu = this.cpu;
        let ip = cpu.pop();
        if (this.dest) {
            cpu.sp += this.dest;
        }
        return ip;
    },

    codes: {
        0xC2: 'Iw',
        0xC3: ''
    }

};
