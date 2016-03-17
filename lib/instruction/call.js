/**
 * @file CALL
 * @author treelite(c.xinle@gmail.com)
 */

export default {

    codes: {
        // TODO
        // 0x9A:
        0xE8: {
            desc: 'Jv',
            // Direct within segment (relative offset of IP)
            compute: function () {
                let cpu = this.cpu;
                // 保存 CALL 之后的下一条指令的地址
                let ip = cpu.ip + this.size;
                cpu.push(ip);
                // 跳转
                return ip + this.dest;
            }
        }
    }

};
