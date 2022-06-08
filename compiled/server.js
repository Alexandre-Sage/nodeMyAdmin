"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const home_1 = __importDefault(require("./routes/home"));
dotenv_1.default.config();
const server = (0, express_1.default)();
server.use((0, cors_1.default)({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
}));
server.use(body_parser_1.default.urlencoded({ extended: false }));
process.env.NODE_ENV === "dev" ? server.use((0, morgan_1.default)("dev")) : null;
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)("secret"));
server.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
    },
}));
server.set('views', path_1.default.join(__dirname, 'views'));
server.set('view engine', 'pug');
server.use(express_1.default.static(path_1.default.join(__dirname, "src")));
server.use('/src', express_1.default.static(path_1.default.join(__dirname, "src")));
server.use('/', home_1.default);
/*server.use(function(req :Request, res:Response, next:NextFunction){
    next(createError(404));
});*/
server.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //res.status(err.status || 500);
    console.log(err);
});
server.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
server.listen(process.env.PORT, () => {
    console.log(`Server listening on: ${process.env.PORT}`);
});
exports.default = server;
