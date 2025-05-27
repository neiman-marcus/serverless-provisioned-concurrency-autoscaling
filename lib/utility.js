"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.ucfirst = exports.truncate = exports.clean = void 0;
const crypto_1 = require("crypto");
const clean = (input) => {
    return (0, exports.truncate)(input.replace(/[^a-z0-9+]+/gi, ''));
};
exports.clean = clean;
const truncate = (input) => {
    return input.length <= 64
        ? input
        : input.substr(0, 32) + (0, crypto_1.createHash)('md5').update(input).digest('hex');
};
exports.truncate = truncate;
const ucfirst = (data) => {
    return `${data.charAt(0).toUpperCase()}${data.slice(1)}`;
};
exports.ucfirst = ucfirst;
const normalize = (functionName) => {
    return (0, exports.ucfirst)(functionName.replace(/-/g, 'Dash').replace(/_/g, 'Underscore'));
};
exports.normalize = normalize;
//# sourceMappingURL=utility.js.map