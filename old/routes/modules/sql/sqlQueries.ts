import mysql,{Pool} from "mysql2";
import {sqlError} from "./sqlError";
import {SqlError} from "../../custom/SqlError";
import {Response} from "express";

export const sqlQuery=async(dataBase:Pool,res:Response,query:string):Promise<Array<object>>=>{
    let response:any;
    await dataBase.promise().query(query)
    .then((dbResponse:Array<object>)=>response=dbResponse)
    .catch((err:SqlError)=>response=sqlError(err,res));
    //console.log(response)
    return response;
};
