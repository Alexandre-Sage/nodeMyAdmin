import {Pool,PoolConnection} from "mysql2";
//import {ErrnoException} from "http-errors";
import {sqlError} from "./sqlError";
import {SqlError} from "../../custom/SqlError";
import {Response} from "express";

export const databaseConnectionTesting=(dataBase:Pool, res:Response)=>{
    const connectionSucess=dataBase.getConnection((err: SqlError | any,conn:PoolConnection)=>conn?true:sqlError(err,res));
    return connectionSucess;
}//sqlError(err,res));


/*const sessionToken=tokenGenerator(75);
session.csurfToken=""
sessionCreation(server,session,dataBase,sessionToken);
const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000}
return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");*/
