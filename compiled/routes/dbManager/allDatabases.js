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
const express_1 = __importDefault(require("express"));
const sessionChecking_1 = require("../modules/sessionManagement/sessionChecking");
const dbManagerFetchAll_1 = __importDefault(require("./dbManagerModules/dbManagerFetchAll"));
const server = (0, express_1.default)();
const router = express_1.default.Router();
const { log } = console;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    if ((0, sessionChecking_1.sessionChecking)(req, session)) {
        const dataBase = req.app.locals.db;
        yield (0, dbManagerFetchAll_1.default)(dataBase, res)
            .then(allDatabases => log(allDatabases))
            .catch(err => log(err));
        // /log(fetchAllDatabasesInfo(dataBase,res))
        return res.render("index", { dataBases: "dataBases" });
    }
    else {
        return res.status(403).json({ message: "Something wrong happened" });
    }
    ;
}));
exports.default = router;
