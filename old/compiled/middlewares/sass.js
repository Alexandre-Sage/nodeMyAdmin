"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sass_middleware_1 = __importDefault(require("node-sass-middleware"));
const path_1 = __importDefault(require("path"));
const sass = (0, node_sass_middleware_1.default)({
    src: __dirname + "/src/styles/scss",
    dest: path_1.default.join(__dirname, '../src/styles/css'),
    debug: process.env.NODE_ENV === "styling" ? true : false,
    indentedSyntax: false,
    error: (err) => console.log(err),
    outputStyle: 'compressed',
});
exports.default = sass;
