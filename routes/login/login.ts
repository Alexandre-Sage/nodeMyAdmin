import express, { Request, Response } from "express";
import connectToDatabase from "../modules/sql/connection";
import dataBaseOptions from "../modules/sql/dbOptions";
import { cookieResponse, tokenGenerator } from "../modules/cookies/general";
import { csurfCookieGenerator, csurfChecking } from "../modules/cookies/csurf";
import { notEmptyCheck } from "../modules/dataValidation/notEmpty";
import { sessionCreation } from "../modules/sessionManagement/sessionCreation";
const router = express.Router();
const server = express();

/*DEV*/
const { log, table } = console;
/**/

router.get("/", (req: Request, res: Response) => {
    const csurfToken = tokenGenerator(50);
    const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
    csurfCookieGenerator(req, csurfToken);
    cookieResponse(res, 200, "CSRF-TOKEN", csurfToken, options).render("home");
});

router.post("/login", async function (req: Request, res: Response) {
    const session = req.session;
    const { userName, password } = req.body;
    const dataBase = dataBaseOptions(userName, password);
    const loginPromiseArray = [csurfChecking(session, req), notEmptyCheck(req.body), connectToDatabase(dataBase)];
    return await Promise.all(loginPromiseArray).then(() => {
        const sessionToken = tokenGenerator(75);
        session.csurfToken = "";
        const options = { httpOnly: true, signed: true, sameSite: true, maxAge: 600000 };
        sessionCreation(req, server, session, dataBase, sessionToken);
        return res.status(200).cookie("SESSION-TOKEN", sessionToken, options).redirect("/");
    })
        .catch(err => res.status(err.httpStatus).json({
            message: err.message,
            error: true
        }));
});
export default router;
