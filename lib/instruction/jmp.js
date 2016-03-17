/**
 * @file JMP
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    compute() {
        let cpu = this.cpu;
        let ip = cpu.ip + this.size;
        // relative offset of IP
        if (this.desc && this.desc.charAt(0) === 'J') {
            ip += this.dest;
        }
        // indirect
        else {
            ip = this.dest;
        }
        return ip;
    },

    codes: {
        0xE9: 'Jv',
        0xEB: 'Jb'
    }

};
