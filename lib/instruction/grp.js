/**
 * @file GRP
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';
import {REG_ADDRESSING} from '../const';

/**
 * GROUP 5 Name
 *
 * @const
 * @type {Array}
 */
const GRP5_NAME = ['INC', 'DEC', 'CALL', 'CALL', 'JMP', 'JMP', 'PUSH'];

/**
 * GROUP 5 Exec
 *
 * @const
 * @type {Object}
 */
const GRP5_EXEC = {
    // Push register/memory
    PUSH: function (cpu) {
        let modRM = this.getModRM(cpu);
        if (modRM === REG_ADDRESSING) {
            cpu.push(cpu[this.getRegName(modRM.rm)]);
            return 2;
        }
        let info = this.address(cpu, modRM);
        cpu.push(cpu.read(info.address, true));
        return 2 + info.size;
    }
};

Instruction.register({
    0xFF: {
        name: 'GRP5 Ev',

        exec: function (cpu) {
            let name = this.getSubName(cpu);
            return GRP5_EXEC[name].call(this, cpu);
        },

        getSubName: function (cpu) {
            let modRM = this.getModRM(cpu);
            return GRP5_NAME[modRM.reg];
        }
    }
});
