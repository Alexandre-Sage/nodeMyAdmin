"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const notEmptyCheck = (req, res, next) => {
    console.log("ok");
    if (req.method === "POST") {
        let validationCount = 0;
        const { isEmpty, isLength } = validator_1.default;
        const requestBody = Object.entries(req.body);
        for (const item of requestBody) {
            const [key, value] = item;
            if (isEmpty(value) && !isLength(value, { min: 2 }))
                break;
            else
                validationCount++;
        }
        ;
        console.assert(validationCount === requestBody.length, "no");
        validationCount === requestBody.length ? next(req.url) : res.status(400).json({ message: "Password or username is empty" }); /*next(console.log("somethinf empty"))*/ //res.status(400).json({message:"Password or username is empty"})
    }
    else {
        next();
    }
};
exports.default = notEmptyCheck;
