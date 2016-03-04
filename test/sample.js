/**
 * @file 简单测试
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * MOV DI 0x8000
 * MOV [DI] 65
 *
 * 8F 00 80
 * C6 05 41
 */

import fs from 'fs';
import Emulator from '../main';

let data = new Buffer(6);
data.writeUInt8(0xBF, 0);
data.writeUInt8(0x00, 1);
data.writeUInt8(0x80, 2);
data.writeUInt8(0xC6, 3);
data.writeUInt8(0x05, 4);
data.writeUInt8(0x41, 5);

let emulator = new Emulator();

emulator.load(data);
emulator.run();
