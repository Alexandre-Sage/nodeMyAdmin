import {Response} from "express";
import {Pool} from "mysql2";
import sqlQuery from "../../modules/sql/sqlQueries";
import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "../sqlRequests/homeRequest"
import {SqlError} from "../../../interfaces/SqlError"
const {log}=console;
export default async function fetchAllDatabasesInfo(dataBaseAdress:Pool,res:Response){
    const dataBases:Array<object>=[];
    await sqlQuery(dataBaseAdress,allDbSqlRequest)
    .then(dataBasesNames=>{
        for(const dataBase of Object.entries(dataBasesNames)[0][1]){
            console.log(dataBase)
        }
    })
    .catch(err=>err)
}

/*export const fetchAllDatabasesInfo=async (dataBaseAdress:Pool,res:Response)=>{
    const dataBasesNames:Array<any>=await sqlQuery(dataBaseAdress,allDbSqlRequest);
    const dataBases:Array<object>=[];
    for(const element of dataBasesNames[0]){
        const tableNumber:Array<any>= await sqlQuery(dataBaseAdress,tableNumSqlRequest(element.Database));
        const dbSize:Array<any> =await sqlQuery(dataBaseAdress,dbSizeSqlRequest(element.Database));
        dataBases.push({dbName:element.Database,tablesNum:tableNumber[0][0]['COUNT(*)'],dbSize:dbSize[0][0]?`${dbSize[0][0].size_mb} MB`:"0 MB"});
    };
    return dataBases;
}*/
