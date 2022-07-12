"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notEmptyCheck = void 0;
const validator_1 = __importDefault(require("validator"));
const notEmptyCheck = (object) => {
    const { isEmpty, isLength } = validator_1.default;
    const responseBody = Object.entries(object);
    let validationCount = 0;
    for (const item of responseBody) {
        const [key, value] = item;
        if (isEmpty(value) && !isLength(value, { min: 2 }))
            break;
        else
            validationCount++;
    }
    ;
    return (validationCount === responseBody.length);
};
exports.notEmptyCheck = notEmptyCheck;
