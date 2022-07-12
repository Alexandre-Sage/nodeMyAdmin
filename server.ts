import http from "http";
import express,{Express,Request,Response,NextFunction} from "express";
import path from "path";
import dotenv from "dotenv";
import createError from "http-errors";
import session,{Session} from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import corsMiddleware from "./middlewares/corsMiddleware";
import sass from "./middlewares/sass";
import home from "./routes/home/home";

import validator from "validator";

//require('dotenv').config();
const server:Express=express();
dotenv.config({path:path.resolve("./.env")});

declare module "express-session" {
    export interface Session{
        csurfToken:string;
        sessionToken:string;
    }
};

server.use(sass);
server.use(corsMiddleware);
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
});*//////////////////???????////////////////
const notEmptyCheck=server.use(function(req:Request,res:Response,next:NextFunction){
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
        validationCount===req.body.length?next():console.log("somethinf empty") //res.status(400).json({message:"Password or username is empty"})
    }else{
        next()
    }
});
server.use(notEmptyCheck) //Remonter le MW avant les routes
const httpServer=http.createServer(server);
httpServer.listen(process.env.PORT,()=>{
    console.log(`Server listening on: ${process.env.PORT}`);
});

export default server;
