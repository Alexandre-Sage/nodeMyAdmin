"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const node_sass_middleware_1 = __importDefault(require("node-sass-middleware"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
//import corsMiddleware from "./middlewares/corsMiddleware";
//import sass from "./middlewares/sass";
const login_1 = __importDefault(require("./routes/login/login"));
const allDatabases_1 = __importDefault(require("./routes/dbManager/allDatabases"));
//import validator from "validator";
//require('dotenv').config();
const server = (0, express_1.default)();
dotenv_1.default.config( /*{path:path.resolve("./.env")}*/);
;
server.use((0, node_sass_middleware_1.default)({
    src: __dirname + "/src/styles/scss",
    dest: path_1.default.join(__dirname, '../src/styles/css'),
    debug: process.env.NODE_ENV === "styling" ? true : false,
    indentedSyntax: false,
    error: (err) => console.log(err),
    outputStyle: 'compressed',
}));
server.use((0, cors_1.default)({
    origin: "http://127.0.0.1:8000" /*`${process.env.HOST}${process.env.PORT}`,"http://localhost:8000"*/,
    methods: ["GET", "POST"],
    credentials: true
}));
server.use(body_parser_1.default.urlencoded({ extended: false }));
process.env.NODE_ENV === "development" ? server.use((0, morgan_1.default)("dev")) : null;
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)("secret"));
server.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        sameSite: "strict"
    },
}));
server.set('views', path_1.default.join(__dirname, 'views'));
server.set('view engine', 'pug');
server.use(express_1.default.static(path_1.default.join(__dirname, "src")));
server.use('/src', express_1.default.static(path_1.default.join(__dirname, "src")));
/*server.use((req:any,res:any,next:any)=>{
    //req.app.locals.db?(server.locals.db=req.app.locals.db, delete req.app.locals.db):null
    next()
})*/
server.use('/', login_1.default);
server.use('/database-manager', allDatabases_1.default);
const httpServer = http_1.default.createServer(server);
httpServer.listen(process.env.PORT, function () {
    console.log(`Server listening on: ${process.env.PORT}`);
});
exports.default = server;
