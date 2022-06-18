"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const crypto_1 = __importStar(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const mysql2_1 = __importDefault(require("mysql2"));
const server = (0, express_1.default)();
const router = express_1.default.Router();
/*DEV*/
const { log, table } = console;
/*router.get("/",function(req:Request,res:Response,next:NextFunction){
    console.log(req.session);
    res.status(200).json({message:"Hello World"})
});*/
router.get("/", (req, res, next) => {
    const csurfToken = crypto_1.default.randomBytes(50).toString('hex');
    const session = req.session;
    session.csurfToken = csurfToken;
    session.save();
    res.status(200).cookie("CSRF-TOKEN", csurfToken, {
        httpOnly: true,
        signed: true,
        sameSite: "strict",
        maxAge: 600000
    }).render("home");
});
router.post("/sign-in", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //log(req.body)
    const session = req.session;
    if (req.signedCookies["CSRF-TOKEN"] === session.csurfToken && session.csurfToken) {
        const { isEmpty, isLength } = validator_1.default;
        const { userName, password } = req.body;
        const dataValidation = isEmpty(userName) || isEmpty(password) ? false : true;
        if (dataValidation) {
            const dataBase = mysql2_1.default.createPool({
                host: "127.0.0.1",
                user: userName,
                password: password,
                port: 3306,
            });
            dataBase.getConnection((err, conn) => {
                if (err) {
                    let message;
                    switch (err.code) {
                        case "ECONNREFUSED":
                            message = "Connection refused please check if mariaDb is enabled.";
                            break;
                        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
                            message = "The provided user doesn't exist.";
                            break;
                        case "ER_ACCESS_DENIED_ERROR":
                            message = "Wrong password";
                            break;
                    }
                    ;
                    res.status(400).json({
                        message: message
                    });
                }
                else if (conn) {
                    const sessionToken = (0, crypto_1.randomBytes)(75).toString('hex');
                    session.csurfToken = "";
                    session.sessionToken = sessionToken;
                    session.save();
                    server.locals.db = dataBase;
                    res.status(200).cookie("SESSION-TOKEN", sessionToken, {
                        httpOnly: true,
                        signed: true,
                        sameSite: "strict",
                        maxAge: 600000,
                    }).redirect("database-manager");
                }
                ;
            });
        }
        else {
            res.status(400).json({
                message: "Password or username is empty"
            });
        }
        ;
    }
    else {
        log(req.signedCookies);
        res.status(403).json({
            message: "Something wrong happened please try again"
        });
    }
    ;
}));
router.get("/database-manager", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if (req.signedCookies["SESSION-TOKEN"] === session.sessionToken) {
        const dataBase = server.locals.db;
        const allDbSqlRequest = "SHOW DATABASES";
        const db = [];
        const dataBases = yield dataBase.promise().query(allDbSqlRequest);
        for (const element of dataBases[0]) {
            const tableNumSqlRequest = `SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${element.Database}";`;
            const dbSizeSqlRequest = `SELECT table_schema "${element.Database}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${element.Database}' GROUP BY table_schema;`;
            const tableNumber = yield dataBase.promise().query(tableNumSqlRequest)
                .then((response) => response[0]);
            const dbSize = yield dataBase.promise().query(dbSizeSqlRequest)
                .then((response) => response[0]);
            const test = { dbName: element.Database, tablesNum: tableNumber[0]['COUNT(*)'], dbSize: dbSize[0] ? `${dbSize[0].size_mb} MB` : "0 MB" };
            log(test);
            db.push({ dbName: element.Database, tablesNum: tableNumber[0]['COUNT(*)'], dbSize: dbSize[0] ? `${dbSize[0].size_mb} MB` : "0 MB" });
        }
        ;
        res.status(200).render("index", { dataBases: db });
    }
    else {
        res.status(403).json({ message: "Something wrong happened" });
    }
}));
router.get("/database-manager/:dbName", (req, res) => {
    const session = req.session;
    if (req.signedCookies["SESSION-TOKEN"] === session.sessionToken) {
        log(req.params);
        const dataBase = server.locals.db;
        dataBase.databse = req.params.dbName;
        const allTableSqlRequest = `SELECT TABLE_NAME  FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA=?;`;
        dataBase.query(allTableSqlRequest, [req.params.dbName], (err, tables) => {
            err ? log(err) : null;
            res.status(200).json(tables);
        });
    }
    else {
        res.status(403).json({ message: "Something wrong happened" });
    }
    ;
});
exports.default = router;
