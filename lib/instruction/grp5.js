/**
 * @file GRP 5
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
const TYPES = ['INC', 'DEC', 'CALL', 'CALL', 'JMP', 'JMP', 'PUSH'];

/**
 * GROUP 5 Exec
 *
 * @const
 * @type {Object}
 */
const EXEC = {
    // Push register/memory
    PUSH: function (cpu) {
        let modRM = this.getModRM(cpu);
        if (modRM.mod === REG_ADDRESSING) {
            cpu.push(cpu[this.getRegName(modRM.rm)]);
            return 2;
        }
        let info = this.address(cpu, modRM);
        cpu.push(cpu.read(info.address, true));
        return 2 + info.size;
    }
};

Instruction.register(
    'grp5',
    {
        0xFF: {
            desc: 'Ev',
            exec: function (cpu) {
                let modRM = this.getModRM(cpu);
                let type = this.subType = TYPES[modRM.reg];
                return EXEC[type].call(this, cpu);
            }
        }
    }
);
