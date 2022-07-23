import http from "http";
import express,{Express,Request,Response,NextFunction} from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import sassMiddleware from "node-sass-middleware";
import session,{Session} from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
//import corsMiddleware from "./middlewares/corsMiddleware";
//import sass from "./middlewares/sass";
import login from "./routes/login/login";
import dbManager from "./routes/dbManager/allDatabases";
//import validator from "validator";


//require('dotenv').config();
const server:Express=express();
dotenv.config(/*{path:path.resolve("./.env")}*/);

declare module "express-session" {
    export interface Session{
        csurfToken:string;
        sessionToken:string;
    }
};

server.use(sassMiddleware({
    src: __dirname+"/src/styles/scss",
    dest: path.join(__dirname, '../src/styles/css'),
    debug: process.env.NODE_ENV==="styling"?true:false,
    indentedSyntax:false,
    error:(err:void)=>console.log(err),
    outputStyle: 'compressed',
}));
server.use(cors({
    origin:"http://127.0.0.1:8000"/*`${process.env.HOST}${process.env.PORT}`,"http://localhost:8000"*/,
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

/*server.use((req:any,res:any,next:any)=>{
    //req.app.locals.db?(server.locals.db=req.app.locals.db, delete req.app.locals.db):null
    next()
})*/

server.use('/', login);
server.use('/database-manager', dbManager);
const httpServer=http.createServer(server);
httpServer.listen(process.env.PORT,function(){
    console.log(`Server listening on: ${process.env.PORT}`);
});

export default server;
