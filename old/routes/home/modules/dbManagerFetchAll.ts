import {Response} from "express";
import {Pool} from "mysql2";
import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "../sqlRequests/homeRequest"
import {sqlQuery} from "../../modules/sql/sqlQueries";

export const fetchAllDatabasesInfo=async (dataBaseAdress:Pool,res:Response)=>{
    const dataBasesNames:Array<any>=await  sqlQuery(dataBaseAdress,res,allDbSqlRequest);
    const dataBases:Array<object>=[];
    for(const element of dataBasesNames[0]){
        const tableNumber:Array<any>= await sqlQuery(dataBaseAdress,res,tableNumSqlRequest(element.Database));
        const dbSize:Array<any>=await sqlQuery(dataBaseAdress,res,dbSizeSqlRequest(element.Database));
        dataBases.push({dbName:element.Database,tablesNum:tableNumber[0][0]['COUNT(*)'],dbSize:dbSize[0][0]?`${dbSize[0][0].size_mb} MB`:"0 MB"});
    };
    return db;
}
