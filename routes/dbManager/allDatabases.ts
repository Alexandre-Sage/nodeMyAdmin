import express, { Request, Response } from "express";
import sessionChecking from "../modules/sessionManagement/sessionChecking";
import fetchAllDatabasesInfo from "./dbManagerModules/dbManagerFetchAll";
import fetchTableInfo from "./dbManagerOneDbTable/fetchTableInfo";

const server = express();
const router = express.Router();
const { log, error } = console;
router.get("/", async function (req: Request, res: Response) {
    const session = req.session;
    const dataBase = req.app.locals.db;
    const promisesArray = [sessionChecking(req, session), fetchAllDatabasesInfo(dataBase, res)];
    try {
        const dataBases = await Promise.all(promisesArray)
        res.status(200).render("index", { dataBases: dataBases[1] })
    } catch (err: any) {
        res.status(err.httpStatus).json({
            message: err.message,
            error: true
        });
    };
    /*Promise.all(promisesArray)
        .then((dataBases) => res.status(200).render("index", { dataBases: dataBases[1] }))
        .catch(err => res.status(err.httpStatus).json({
            message: err.message,
            error: true
        }));*/
});

router.get("/:dbName", async function (req: Request, res: Response) {
    const session = req.session;
    const dataBase = req.app.locals.db;
    const { dbName } = req.params;
    try {
        await sessionChecking(req, session);
        const tablesInfo = await fetchTableInfo(dataBase, dbName);
        res.status(200).json({
            tablesInfo: tablesInfo,
            error: false
        });
    } catch (err: any) {
        res.status(err.httpStatus).json({
            message: err.message,
            error: true
        });
    };
    /*sessionChecking(req, session)
        .then(() => fetchTableInfo(dataBase, dbName))
        .then(tablesInfo => (
            res.status(200).json({
                tablesInfo: tablesInfo,
                error: false
            })
        ))
        .catch(err => (
            res.status(err.httpStatus).json({
                message: err.message,
                error: true
            })
        ));*/
});
//A faire: trouver le nombre d'entrée dans une table, afficher les entrées d'une table 
export default router;
