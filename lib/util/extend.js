/**
 * @file extend
 * @author treelite(c.xinle@gmail.com)
 */

let cpy = (target, source) => Object.keys(source).forEach(key => target[key] = source[key]);

/**
 * 对象扩展
 *
 * @public
 * @param {Object} target 目标对象
 * @param {...Object} sources 源对象
 * @return {Object}
 */
export default function (target, ...sources) {
    for (let item of sources) {
        if (item) {
            cpy(target, item);
        }
    }
    return target;
}
