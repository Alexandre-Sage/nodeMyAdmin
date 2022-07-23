import {Response} from "express";
import {Pool} from "mysql2";
import sqlQuery from "../../modules/sql/sqlQueries";
import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "../sqlRequests/homeRequest"
import {SqlError} from "../../../interfaces/SqlError"
const {log}=console;
export default async function fetchAllDatabasesInfo(dataBaseAdress:Pool,res:Response){
    const dataBases:Array<object>=[];
    await sqlQuery(dataBaseAdress,allDbSqlRequest)
    .then(async dataBasesNames=>{
        for(const dataBase of Object.entries(dataBasesNames)[0][1]){
            const name=dataBase.Database
            log(name)
            Promise.all([
                await sqlQuery(dataBaseAdress,tableNumSqlRequest(dataBase.Database)),
                await sqlQuery(dataBaseAdress,dbSizeSqlRequest(dataBase.Database))
            ]).then(resolved=>{
                const tableNumber=Object.entries(resolved[0])[0][1][0]['COUNT(*)'];
                const dbSize=Object.entries(resolved[1])[0][1][0]?Object.entries(resolved[1])[0][1][0].size_mb:0;
                dataBases.push({dbName:name,tablesNum:tableNumber,dbSize:`${dbSize} MB`});
            }).catch(err=>log(err));
        };
    }).catch((err:SqlError)=>err);
};
