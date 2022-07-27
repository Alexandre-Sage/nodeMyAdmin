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
const sessionChecking_1 = require("../modules/sessionManagement/sessionChecking");
const dbManagerFetchAll_1 = require("./modules/dbManagerFetchAll");
const server = (0, express_1.default)();
const router = express_1.default.Router();
/*DEV*/
const { log, table } = console;
/**/
/*router.get("/",(req:Request,res:Response)=>{
    const csurfToken=tokenGenerator(50);
    const options={httpOnly: true, signed: true, sameSite: true, maxAge:600000};
    csurfCookieGenerator(req,csurfToken);
    return cookieResponse(res,200,"CSRF-TOKEN",csurfToken,options).render("home");
});

router.post("/sign-in",async(req:Request,res:Response)=>{
    const session=req.session;
    if(csurfChecking(session,req) && notEmptyCheck(req.body)){
        const {userName,password}=req.body;
        const dataBase=dataBaseOptions(userName,password);
        databaseConnectionTesting(server,dataBase,res,session);
    }else{
        const status=!notEmptyCheck(req.body)?400:403;
        const message=!notEmptyCheck(req.body)?"Password or username is empty":"Something wrong happened please try again";
        res.status(status).json({
            message: message
        });
    };
});*/
router.get("/database-manager", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if ((0, sessionChecking_1.sessionChecking)(req, session)) {
        const dataBase = server.locals.db;
        const dataBases = yield (0, dbManagerFetchAll_1.fetchAllDatabasesInfo)(dataBase, res);
        return res.render("index", { dataBases: dataBases });
    }
    else {
        return res.status(403).json({ message: "Something wrong happened" });
    }
    ;
}));
router.get("/database-manager/:dbName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if ((0, sessionChecking_1.sessionChecking)(req, session)) {
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
