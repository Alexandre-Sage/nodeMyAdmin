"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
//dotenv.config({path:path.resolve("./.env")});
console.log(process.env.PORT);
const corsMiddleware = (0, cors_1.default)({
    origin: "http://127.0.0.1:8000" /*`${process.env.HOST}${process.env.PORT}`,"http://localhost:8000"*/,
    methods: ["GET", "POST"],
    credentials: true
});
exports.default = corsMiddleware;
