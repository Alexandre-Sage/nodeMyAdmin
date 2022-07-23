import {Pool} from "mysql2";
import {SqlError} from "../../../interfaces/SqlError";

export default async function sqlQuery(dataBase:Pool,query:string):Promise<object[] | SqlError>{
    return await dataBase.promise().query(query)
    .then((dbResponse:object[])=>dbResponse)
    .catch((err:SqlError)=>err);
};
