import sqlQuery from "../../modules/sql/sqlQueries";


export default function getOneDbTables() {
    await sqlQuery(dataBase, itExsitSqlRequest, [dbName])
        .then(existing => { log("ex", existing), dataBase.database = dbName })
        .catch(err => log(err))
    await sqlQuery(dataBase, tableSizeSqlRequest, [dbName])
        .then((tables) => log("tables", tables))
        .catch((err: any) => log(err));
};