import express,{Request,Response} from "express";
import {cookieResponse,tokenGenerator} from "../modules/cookies/general";
import {csurfCookieGenerator,csurfChecking} from "../modules/cookies/csurf";
import {notEmptyCheck} from "../modules/dataValidation/notEmpty";
import {sessionCreation} from "../modules/sessionManagement/sessionCreation";
import connectToDatabase from "../modules/sql/connection";
import {sqlError} from "../modules/sql/sqlError";
import dataBaseOptions from "../modules/sql/dbOptions";

const server=express();
const router=express.Router();

/*DEV*/
const {log,table}=console;
/**/

router.get("/",(req:Request,res:Response)=>{
    const csurfToken=tokenGenerator(50);
    const options={httpOnly: true, signed: true, sameSite: true, maxAge:600000};
    csurfCookieGenerator(req,csurfToken);
    return cookieResponse(res,200,"CSRF-TOKEN",csurfToken,options).render("home");
});

router.post("/login",async (req:Request,res:Response)=>{
    const session=req.session;
    if(csurfChecking(session,req) && notEmptyCheck(req.body)){
        const {userName,password}=req.body;
        const dataBase=dataBaseOptions(userName,password);
        await connectToDatabase(dataBase)
        .then((resolved:any)=>{
            const sessionToken=tokenGenerator(75);
            session.csurfToken="";
            const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000};
            sessionCreation(server,session,dataBase,sessionToken);
            cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");
        })
        .catch(err=>sqlError(err,res));
    };
});
export default router;
