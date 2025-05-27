"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("util"));
const utility_1 = require("./utility");
const TEXT = {
    POLICYSCALE: '%s-AutoScalingPolicy',
    TARGET: '%s-AutoScalingTarget',
};
class Name {
    constructor(options) {
        this.options = options;
    }
    target(func) {
        return (0, utility_1.clean)(this.build(TEXT.TARGET, func));
    }
    policy(func) {
        return (0, utility_1.clean)(this.build(TEXT.POLICYSCALE, func));
    }
    PCAliasLogicalId(functionName) {
        return `${(0, utility_1.normalize)(functionName)}ProvConcLambdaAlias`;
    }
    build(data, func) {
        return [
            this.prefix(),
            (0, utility_1.ucfirst)(util.format(data, func)),
            this.suffix(),
        ].join('');
    }
    prefix() {
        return (0, utility_1.ucfirst)(this.options.service);
    }
    suffix() {
        return [this.options.stage, this.options.region].map(utility_1.ucfirst).join('');
    }
}
exports.default = Name;
//# sourceMappingURL=name.js.map