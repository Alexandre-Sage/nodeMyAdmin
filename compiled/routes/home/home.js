"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*Sur pour le moment*/
const express_1 = __importDefault(require("express"));
const general_1 = require("../modules/cookies/general");
const csurf_1 = require("../modules/cookies/csurf");
const sessionCreation_1 = require("../modules/sessionManagement/sessionCreation");
const connectionTest_1 = require("../modules/sql/connectionTest");
/*Sait pas*/
const dbOptions_1 = require("../modules/sql/dbOptions");
/**/
/*Potentiellement a enlever*/
const sqlError_1 = require("../modules/sql/sqlError");
const validator_1 = __importDefault(require("validator"));
const homeRequest_1 = require("./sqlRequests/homeRequest");
const server = (0, express_1.default)();
const router = express_1.default.Router();
/*DEV*/
const { log, table } = console;
/**/
router.get("/", (req, res) => {
    const csurfToken = (0, general_1.tokenGenerator)(50);
    const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
    (0, csurf_1.csurfCookieGenerator)(req, csurfToken);
    return (0, general_1.cookieResponse)(res, 200, "CSRF-TOKEN", csurfToken, options).render("home");
});
router.post("/sign-in", (req, res) => {
    const session = req.session;
    const { userName, password } = req.body;
    const { isEmpty, isLength } = validator_1.default;
    const dataValidation = !(isEmpty(userName) || isEmpty(password));
    if ((0, csurf_1.csurfChecking)(session, req) && dataValidation) {
        const dataBase = (0, dbOptions_1.dataBaseOptions)(userName, password);
        console.log("here", (0, connectionTest_1.databaseConnectionTesting)(dataBase, res));
        dataBase.getConnection((err, conn) => {
            if (err) {
                (0, sqlError_1.sqlError)(err, res);
            }
            else if (conn) {
                //console.log(databaseConnectionTesting(dataBase,res));
                const sessionToken = (0, general_1.tokenGenerator)(75);
                session.csurfToken = "";
                (0, sessionCreation_1.sessionCreation)(server, session, dataBase, sessionToken);
                const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
                return (0, general_1.cookieResponse)(res, 200, "SESSION-TOKEN", sessionToken, options).redirect("database-manager");
            }
            ;
        });
    }
    else {
        const status = !dataValidation ? 400 : 403;
        const message = !dataValidation ? "Password or username is empty" : "Something wrong happened please try again";
        res.status(status).json({
            message: message
        });
    }
    ;
    //return response
});
router.get("/database-manager", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if (req.signedCookies["SESSION-TOKEN"] === session.sessionToken) {
        const dataBase = server.locals.db;
        const db = [];
        const dataBases = yield dataBase.promise().query(homeRequest_1.allDbSqlRequest)
            .then((response) => response[0])
            .catch((err) => log(err));
        for (const element of dataBases) {
            const tableNumber = yield dataBase.promise().query((0, homeRequest_1.tableNumSqlRequest)(element.Database))
                .then((response) => response[0])
                .catch((err) => log(err));
            const dbSize = yield dataBase.promise().query((0, homeRequest_1.dbSizeSqlRequest)(element.Database))
                .then((response) => response[0])
                .catch((err) => log(err));
            db.push({ dbName: element.Database, tablesNum: tableNumber[0]['COUNT(*)'], dbSize: dbSize[0] ? `${dbSize[0].size_mb} MB` : "0 MB" });
        }
        ;
        res.status(200).render("index", { dataBases: db });
    }
    else {
        res.status(403).json({ message: "Something wrong happened" });
    }
}));
router.get("/database-manager/:dbName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if (req.signedCookies["SESSION-TOKEN"] === session.sessionToken) {
        const dataBase = server.locals.db;
        const { dbName } = req.params;
        let sucess = false;
        do {
            const itExsitSqlRequest = `USE ${dbName};`;
            yield dataBase.promise().query(itExsitSqlRequest)
                .then((response) => sucess = true)
                .catch((err) => res.status(403).json({ message: `${err.code}, ${err.sqlMessage}` }));
        } while (!sucess);
        {
            dataBase.database = dbName;
            const allTableSqlRequest = `SELECT TABLE_NAME  FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA=?;`;
            const tableSizeSqlRequest = `SELECT table_name AS "Table", round(((data_length + index_length) / 1024 / 1024), 2) "table_size" FROM information_schema.TABLES WHERE table_schema= ?`;
            dataBase.query(allTableSqlRequest, [dbName], (err, tables) => {
                //table(tables)
                err ? log(err) : null;
                res.status(200).json(tables);
            });
        }
        ;
    }
    else {
        res.status(403).json({ message: "Something wrong happened" });
    }
    ;
}));
exports.default = router;
//Programation fonctionelle
