import express, { Request, Response } from "express";
import sessionChecking from "../modules/sessionManagement/sessionChecking";
import fetchAllDatabasesInfo from "./dbManagerModules/dbManagerFetchAll";

import { SqlError } from "../../interfaces/SqlError";
import sqlQuery from "../modules/sql/sqlQueries";
import { itExistSqlRequest, tableInfoSqlRequest } from "./sqlRequests/homeRequest";

const server = express();
const router = express.Router();
const { log, error } = console;
router.get("/", async function (req: Request, res: Response) {
    const session = req.session;
    const dataBase = req.app.locals.db;
    const promisesArray = [sessionChecking(req, session), fetchAllDatabasesInfo(dataBase, res)];
    await Promise.all(promisesArray)
        .then((dataBases) => res.status(200).render("index", { dataBases: dataBases[1] }))
        .catch(err => res.status(err.httpStatus).json({
            message: err.message,
            error: true
        }));
});

router.get("/:dbName", async function (req: Request, res: Response) {
    const session = req.session;
    const dataBase = req.app.locals.db;
    const { dbName } = req.params;
    await sessionChecking(req, session)
        .then(() => sqlQuery(dataBase, itExistSqlRequest(dbName)))
        .then(() => dataBase.database = dbName)
        .then(() => sqlQuery(dataBase, tableInfoSqlRequest, [dbName]))
        .then(tablesInfo => log(Object.entries(tablesInfo[0])))
        .catch(err => res.status(err.httpStatus).json({
            message: err.message,
            error: true
        }));
    res.status(200).render("index");
});

export default router;
