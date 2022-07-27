import express,{Request,Response} from "express";
import {SqlError} from "../../interfaces/SqlError";
import connectToDatabase from "../modules/sql/connection";
import dataBaseOptions from "../modules/sql/dbOptions";
import {cookieResponse,tokenGenerator} from "../modules/cookies/general";
import {csurfCookieGenerator,csurfChecking} from "../modules/cookies/csurf";
import {notEmptyCheck} from "../modules/dataValidation/notEmpty";
import {sessionCreation} from "../modules/sessionManagement/sessionCreation";
import {sqlError} from "../modules/sql/sqlError";
const router=express.Router();
const server=express();

/*DEV*/
const {log,table}=console;
/**/

router.get("/",(req:Request,res:Response)=>{
    const csurfToken=tokenGenerator(50);
    const options={httpOnly: true, signed: true, sameSite: true, maxAge:600000};
    csurfCookieGenerator(req,csurfToken);
    cookieResponse(res,200,"CSRF-TOKEN",csurfToken,options).render("home");
});

router.post("/login",async (req:Request,res:Response)=>{
    const session=req.session;
    if(csurfChecking(session,req) && notEmptyCheck(req.body)){
        const {userName,password}=req.body;
        const dataBase=dataBaseOptions(userName,password);
        await connectToDatabase(dataBase)
        .then((resolved)=>{
            const sessionToken=tokenGenerator(75);
            session.csurfToken="";
            const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000};
            sessionCreation(req,server,session,dataBase,sessionToken);
            return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");
        }).catch((err:SqlError)=>sqlError(err,res));
    }else if(!notEmptyCheck(req.body)){
        res.status(400).json({message:"Username or password is empty."})
    }else if(csurfChecking(session,req)) {
        res.status(403).json({message:"Something went wrong please retry"});
    }
});
export default router;
