import http from "http";
import express,{Express,Request,Response,NextFunction} from "express";
import path from "path";
import dotenv from "dotenv";
import createError from "http-errors";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware"
import home from "./routes/home";

dotenv.config();
const server:Express=express();

declare module "express-session" {
    export interface Session{
        csurfToken:string;
        sessionToken:string;
    }
};

server.use(sassMiddleware({
    src: __dirname+"/src/styles/scss",
    dest: path.join(__dirname, '/src/styles/css'),
    debug: process.env.NODE_ENV==="development"?true:false,
    indentedSyntax:false,
    error:(err:void)=>console.log(err),
    outputStyle: 'compressed',
    //prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

server.use(cors({
    origin:`${process.env.HOST}${process.env.PORT}`,
    methods: ["GET","POST"],
    credentials:true
}));

server.use(bodyParser.urlencoded({extended:false}));
process.env.NODE_ENV==="development"?server.use(logger("dev")):null;
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(cookieParser("secret"));
server.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized:false,
    cookie:{
        httpOnly:false,
        sameSite:"strict"
    },
}));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');
server.use(express.static(path.join(__dirname, "src")));
server.use('/src', express.static(path.join(__dirname, "src")));
server.use('/', home);

/*server.use(function(req :Request, res:Response, next:NextFunction){
    next(createError(404));
});*/

server.use(function(err:Error, req:Request, res:Response, next:NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //res.status(err.status || 500);
    console.log(err)
});

/**/
/*process.on('warning', (warning) => {
    console.log(warning.stack);
});*/
/**/
server.use((err:any, req :Request, res:Response, next:NextFunction)=>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
const httpServer=http.createServer(server);
httpServer.listen(process.env.PORT,()=>{
    console.log(`Server listening on: ${process.env.PORT}`);
});

export default server;
