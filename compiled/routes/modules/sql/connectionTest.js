"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnectionTesting = void 0;
//import {ErrnoException} from "http-errors";
const sqlError_1 = require("./sqlError");
const databaseConnectionTesting = (dataBase, res) => {
    const connectionSucess = dataBase.getConnection((err, conn) => conn ? true : (0, sqlError_1.sqlError)(err, res));
    return connectionSucess;
}; //sqlError(err,res));
exports.databaseConnectionTesting = databaseConnectionTesting;
/*const sessionToken=tokenGenerator(75);
session.csurfToken=""
sessionCreation(server,session,dataBase,sessionToken);
const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000}
return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");*/
