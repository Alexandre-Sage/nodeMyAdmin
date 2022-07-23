import {Pool,PoolConnection} from "mysql2";
import {SqlError} from "../../../interfaces/SqlError";

export default function connectToDatabase(dataBase:Pool):Promise<SqlError | boolean>{
    return new Promise((resolve,reject)=>dataBase.getConnection(
        (err:SqlError | any,conn:PoolConnection)=>err?reject(err):resolve(true)
    ));
};
