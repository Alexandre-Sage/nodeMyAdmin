"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const sass_1 = __importDefault(require("./middlewares/sass"));
const home_1 = __importDefault(require("./routes/home/home"));
//require('dotenv').config();
const server = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.resolve("./.env") });
;
server.use(sass_1.default);
server.use(corsMiddleware_1.default);
server.use((req) => console.log(req));
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
server.use('/', home_1.default);
/*server.use(function(req :Request, res:Response, next:NextFunction){
    next(createError(404));
});*/
////////////////////////???????/////////////////////////
/*server.use(function(err:Error, req:Request, res:Response, next:NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //res.status(err.status || 500);
    console.log("///////////ERRRROOOOORRRR///////////////")
    console.log(err)
});

server.use((err:any, req :Request, res:Response, next:NextFunction)=>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});*/ /////////////////???????////////////////
/*const notEmptyCheck=server.use(function(req:Request,res:Response,next:NextFunction){
console.log("here",req)
console.log("ok")
if(req.method==="POST"){
    let validationCount=0;
    const {isEmpty,isLength}=validator;
    for(const item of req.body){
        console.log("here")
        const [key,value]=item;
        if(isEmpty(value) && !isLength(value,{min:2})) break;
        else validationCount++;
    };
    validationCount===req.body.length?next():console.log("somethinf empty")/*res.status(400).json({message:"Password or username is empty"})
}else{
    next()
}
});*/
//server.use(notEmptyCheck)
const httpServer = http_1.default.createServer(server);
httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on: ${process.env.PORT}`);
});
exports.default = server;
