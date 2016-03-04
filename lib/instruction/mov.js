/**
 * @file MOV
 * @author treelite(c.xinle@gmail.com)
 */

import Instruction from './Instruction';

Instruction.register({

    0xB0: {
        name: 'MOV AL Ib',
        exec: function (cpu) {
            cpu.al = cpu.read(this.ip + 1);
            return 2;
        }
    },

    0xBF: {
        name: 'MOV DI Iv',
        exec: function (cpu) {
            cpu.di = cpu.read(this.ip + 1) + cpu.read(this.ip + 2) << 8;
            return 3;
        }
    },

    0xC6: {
        name: 'MOV Eb Ib',
        exec: function (cpu) {
            let modRM = this.getModRM(cpu.read(this.ip + 1));

            if (modRM.mod === 3) {
                cpu[this.getRegName(modRM.reg)] = cpu.read(this.ip + 2);
                return 3;
            }
            else {
                let mod = modRM.mod;
                let info = this.address(cpu, modRM, this.ip);
                let immed = cpu.read(this.ip + 2 + info.size);
                cpu.write(info.address, immed);
                return 3 + info.size;
            }
        }
    }

});
