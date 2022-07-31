import express,{Request,Response} from "express";
import sessionChecking from "../modules/sessionManagement/sessionChecking";
import fetchAllDatabasesInfo from "./dbManagerModules/dbManagerFetchAll";


const server=express();
const router=express.Router();
const {log}=console;
router.get("/",async function(req:Request,res:Response){
    const session=req.session;
    const dataBase=req.app.locals.db;
    const promisesArray=[sessionChecking(req,session),fetchAllDatabasesInfo(dataBase,res)];
    await Promise.all(promisesArray)
    .then((dataBases)=>res.status(200).render("index",{dataBases:dataBases[1]}))
    .catch(err=>{log(err);res.status(400/*err.httpStatus*/).json({
        message: err.message,
        error:true
    })});
});
export default router;
