/**
 * @file cosnt
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 寄存器寻址标示
 *
 * @const
 * @type {number}
 */
export const REG_ADDRESSING = 3;

/**
 * 段寄存器编号
 *
 * @const
 * @type {Array}
 */
export const SEG_REG_ORDER = ['es', 'cs', 'ss', 'ds'];

/**
 * 寄存器编号
 *
 * @const
 * @type {Array}
 */
export const REG_ORDER = [
    ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'],
    ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di']
];
