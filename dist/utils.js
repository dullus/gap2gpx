"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInterface = exports.createTag = void 0;
function createTag(options) {
    const howManyTabs = options.closing && options.name === options.lastParent ? 0 : options.level;
    let levelMinus = false;
    let singleTag = false;
    let tabs = '';
    let tag = '';
    for (let i = 0; i < howManyTabs; i++) {
        tabs = `${tabs}  `;
    }
    if (options.closing) {
        tag = options.name === options.lastParent ? '</' : `\n${tabs}</`;
    }
    else {
        tag = `\n${tabs}<`;
    }
    tag = tag + options.name;
    if (options.attrs !== undefined) {
        Object.keys(options.attrs).forEach((attr) => {
            let val = options.attrs[attr];
            if (val.substr(-2) === ' /') {
                singleTag = true;
                val = val.substr(0, val.length - 2);
            }
            tag = `${tag} ${attr}="${val}"`;
        });
    }
    if (options.name.includes('/') || singleTag) {
        levelMinus = true;
    }
    tag = `${tag}${singleTag ? ' />' : '>'}`;
    return {
        levelMinus,
        tag
    };
}
exports.createTag = createTag;
/**
 * Simple runtime check if 'obj' fullfills interface 'T'
 * Checks only if all 'props' are present in 'obj'.
 */
function isInterface(obj, props) {
    let valid = true;
    valid = valid && !!obj && typeof obj === 'object';
    props.forEach((prop) => {
        valid = valid && prop in obj;
    });
    return valid;
}
exports.isInterface = isInterface;
//# sourceMappingURL=utils.js.map