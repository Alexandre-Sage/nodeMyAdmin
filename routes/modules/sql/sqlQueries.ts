import {Pool} from "mysql2";
import {SqlError} from "../../../interfaces/SqlError";

export default async function sqlQuery(dataBase:Pool,query:string,preparedArray?:Array<any>):Promise<object[] | SqlError>{
    return await dataBase.promise().query(query,preparedArray?preparedArray:undefined)
    .then((dbResponse:object[])=>dbResponse)
    .catch((err:SqlError)=>err);
};
