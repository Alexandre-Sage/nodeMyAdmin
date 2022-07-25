import express,{Request,Response} from "express";
import {sessionChecking} from "../modules/sessionManagement/sessionChecking";
import fetchAllDatabasesInfo from "./dbManagerModules/dbManagerFetchAll";


const server=express();
const router=express.Router();
const {log}=console;
router.get("/",async(req:Request,res:Response)=>{
    const session=req.session;
    if(sessionChecking(req,session)){
        const dataBase=req.app.locals.db;
        await fetchAllDatabasesInfo(dataBase,res)
        .then(allDatabases=>log(allDatabases))
        .catch(err=>log(err))
        // /log(fetchAllDatabasesInfo(dataBase,res))
        return res.render("index",{dataBases:"dataBases"});
    }else{
        return res.status(403).json({message:"Something wrong happened"});
    };
});
export default router;
