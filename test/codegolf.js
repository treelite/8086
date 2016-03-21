/**
 * @file code golf
 * @author treelite(c.xinle@gmail.com)
 */

import fs from 'fs';
import path from 'path';
import Emulator from '../main';

let code = fs.readFileSync(path.resolve(__dirname, '../../test/codegolf'));
let emulator = new Emulator();

emulator.load(code);
let res = emulator.run();
let cpu = emulator.cpu;

if (res.code !== 0) {
    console.error('Error');
    console.error(res);
}
