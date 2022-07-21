"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnectionTesting = void 0;
//import {ErrnoException} from "http-errors";
const sqlError_1 = require("./sqlError");
const general_1 = require("../cookies/general");
const sessionCreation_1 = require("../sessionManagement/sessionCreation");
const databaseConnectionTesting = (server, dataBase, res, session) => {
    dataBase.getConnection((err, conn) => {
        if (err) {
            (0, sqlError_1.sqlError)(err, res);
        }
        else {
            const sessionToken = (0, general_1.tokenGenerator)(75);
            session.csurfToken = "";
            (0, sessionCreation_1.sessionCreation)(server, session, dataBase, sessionToken);
            const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
            return (0, general_1.cookieResponse)(res, 200, "SESSION-TOKEN", sessionToken, options).redirect("database-manager");
        }
        ;
    });
};
exports.databaseConnectionTesting = databaseConnectionTesting;
/*export const databaseConnectionTesting=(dataBase:Pool, res:Response,session:Session)=>{
    const connectionSucess=dataBase.getConnection((err: SqlError | any,conn:PoolConnection)=>console.log(err));
    console.log("fuck",connectionSucess)
    return connectionSucess;
}*/ //sqlError(err,res));
/*const sessionToken=tokenGenerator(75);
session.csurfToken=""
sessionCreation(server,session,dataBase,sessionToken);
const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000}
return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");*/
