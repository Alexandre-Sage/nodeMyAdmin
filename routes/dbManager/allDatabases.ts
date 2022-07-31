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
        let allDatabases:Array<object> | undefined;
        await fetchAllDatabasesInfo(dataBase,res)
        .then(allDatabases=>allDatabases=allDatabases)
        .catch(err=>log(err))
        res.render("index",{dataBases:allDatabases});
    }else{
        res.status(403).json({message:"Something wrong happened"});
    };
});
export default router;
