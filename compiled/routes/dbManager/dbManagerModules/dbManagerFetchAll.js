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
const sqlQueries_1 = __importDefault(require("../../modules/sql/sqlQueries"));
const homeRequest_1 = require("../sqlRequests/homeRequest");
const { log } = console;
function fetchAllDatabasesInfo(dataBaseAdress, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataBases = [];
        let error;
        yield (0, sqlQueries_1.default)(dataBaseAdress, homeRequest_1.allDbSqlRequest)
            .then((dataBasesNames) => __awaiter(this, void 0, void 0, function* () {
            //for(const some of dataBasesNames){}
            for (const dataBase of Object.entries(dataBasesNames)[0][1]) {
                const name = dataBase.Database;
                Promise.all([
                    yield (0, sqlQueries_1.default)(dataBaseAdress, (0, homeRequest_1.tableNumSqlRequest)(dataBase.Database)),
                    yield (0, sqlQueries_1.default)(dataBaseAdress, (0, homeRequest_1.dbSizeSqlRequest)(dataBase.Database))
                ]).then(resolved => {
                    const tableNumber = Object.entries(resolved[0])[0][1][0]['COUNT(*)'];
                    const dbSize = Object.entries(resolved[1])[0][1][0] ? Object.entries(resolved[1])[0][1][0].size_mb : 0;
                    dataBases.push({ dbName: name, tablesNum: tableNumber, dbSize: `${dbSize} MB` });
                }).catch(err => error = err);
            }
            ;
        })).catch((err) => error = err);
        return error ? error : dataBases;
    });
}
exports.default = fetchAllDatabasesInfo;
;
