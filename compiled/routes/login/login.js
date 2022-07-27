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
const connection_1 = __importDefault(require("../modules/sql/connection"));
const dbOptions_1 = __importDefault(require("../modules/sql/dbOptions"));
const general_1 = require("../modules/cookies/general");
const csurf_1 = require("../modules/cookies/csurf");
const notEmpty_1 = require("../modules/dataValidation/notEmpty");
const sessionCreation_1 = require("../modules/sessionManagement/sessionCreation");
const sqlError_1 = require("../modules/sql/sqlError");
const router = express_1.default.Router();
const server = (0, express_1.default)();
/*DEV*/
const { log, table } = console;
/**/
router.get("/", (req, res) => {
    const csurfToken = (0, general_1.tokenGenerator)(50);
    const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
    (0, csurf_1.csurfCookieGenerator)(req, csurfToken);
    (0, general_1.cookieResponse)(res, 200, "CSRF-TOKEN", csurfToken, options).render("home");
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = req.session;
    log(req.body);
    if ((0, csurf_1.csurfChecking)(session, req) && (0, notEmpty_1.notEmptyCheck)(req.body)) {
        const { userName, password } = req.body;
        const dataBase = (0, dbOptions_1.default)(userName, password);
        yield (0, connection_1.default)(dataBase)
            .then((resolved) => {
            const sessionToken = (0, general_1.tokenGenerator)(75);
            session.csurfToken = "";
            const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
            (0, sessionCreation_1.sessionCreation)(req, server, session, dataBase, sessionToken);
            return (0, general_1.cookieResponse)(res, 200, "SESSION-TOKEN", sessionToken, options).redirect("database-manager");
        }).catch((err) => (0, sqlError_1.sqlError)(err, res));
    }
    else if (!(0, notEmpty_1.notEmptyCheck)(req.body)) {
        res.status(400).json({ message: "Username or password is empty." });
    }
    else if ((0, csurf_1.csurfChecking)(session, req)) {
        res.status(403).json({ message: "Something went wrong please retry" });
    }
}));
exports.default = router;
