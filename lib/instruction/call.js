/**
 * @file CALL
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    compute() {
        let cpu = this.cpu;
        // 保存 CALL 之后的下一条指令的地址
        let ip = cpu.ip + this.size;
        cpu.push(ip);

        // Relative offset of IP
        if (this.desc && this.desc.charAt(0) === 'J') {
            ip += this.dest;
        }
        // Indirect within segment
        else {
            ip = this.dest;
        }

        return ip;
    },

    codes: {
        // TODO
        // 0x9A:
        0xE8: 'Jv'
    }

};
