import { Pool } from "mysql2";
import { SqlError } from "../../../interfaces/SqlError";
import sqlError from "./sqlError";

export default async function sqlQuery(dataBase: Pool, query: string, preparedArray?: Array<any>): Promise<Array<any> | SqlError> {
    return await dataBase.promise().query(query, preparedArray ? preparedArray : undefined)
        .then((dbResponse: Array<any>) => dbResponse)
        .catch((err: SqlError) => err);
};
