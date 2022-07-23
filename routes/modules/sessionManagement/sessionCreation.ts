import {Express} from "express";
import {Pool} from "mysql2";
import {Session} from "express-session";

export const sessionCreation = (req:any,server:Express, session:Session, dataBase:Pool, sessionToken:string)=>{
    console.log("before",req.app.locals.db)
    session.sessionToken=sessionToken;
    session.save();
    return req.app.locals.db=dataBase;
    //console.log(server.locals.db)
};
