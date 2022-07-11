import {Express} from "express";
import {Pool} from "mysql2";
import {Session} from "express-session";
export const sessionCreation = (server:Express, session:Session, dataBase:Pool, sessionToken:string)=>{
    session.sessionToken=sessionToken;
    session.save();
    server.locals.db=dataBase;
};
