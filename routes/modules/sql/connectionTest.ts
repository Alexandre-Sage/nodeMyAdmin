import {Express} from "express";
import {Pool,PoolConnection} from "mysql2";
import {Session} from "express-session";
//import {ErrnoException} from "http-errors";
import {sqlError} from "./sqlError";
import {SqlError} from "../../custom/SqlError";
import {Response} from "express";
import {cookieResponse,tokenGenerator} from "../cookies/general";
import {sessionCreation} from "../sessionManagement/sessionCreation";

export const databaseConnectionTesting=(server:Express,dataBase:Pool, res:Response,session:Session)=>{
    dataBase.getConnection((err:SqlError | any,conn:PoolConnection)=>{
        if(err){
            sqlError(err,res)
        }else{
            const sessionToken=tokenGenerator(75);
            session.csurfToken="";
            sessionCreation(server,session,dataBase,sessionToken);
            const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000};
            return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");
        };
    });
};

/*export const databaseConnectionTesting=(dataBase:Pool, res:Response,session:Session)=>{
    const connectionSucess=dataBase.getConnection((err: SqlError | any,conn:PoolConnection)=>console.log(err));
    console.log("fuck",connectionSucess)
    return connectionSucess;
}*///sqlError(err,res));


/*const sessionToken=tokenGenerator(75);
session.csurfToken=""
sessionCreation(server,session,dataBase,sessionToken);
const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000}
return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");*/
