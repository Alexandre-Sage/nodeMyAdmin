import sqlQuery from "../../modules/sql/sqlQueries";
import { itExistSqlRequest, tableInfoSqlRequest } from "../sqlRequests/homeRequest";
import { Pool } from "mysql2";
import { SqlError } from "../../../interfaces/SqlError";

export default function fetchTableInfo(dataBase: any, dbName: string) {
    return sqlQuery(dataBase, itExistSqlRequest(dbName))
        .then(() => (
            dataBase.database = dbName,
            sqlQuery(dataBase, tableInfoSqlRequest, [dbName])
        ))
        .then((tablesInfo: Array<object>) => tablesInfo[0])
        .catch((err) => err);
};