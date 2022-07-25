"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
function dataBaseOptions(userName, password, host = "127.0.0.1", port = 3306) {
    return mysql2_1.default.createPool({
        host: host,
        user: userName,
        password: password,
        port: port,
    });
}
exports.default = dataBaseOptions;
