/*Sur pour le moment*/
import express,{Request,Response} from "express";
import {cookieResponse,tokenGenerator} from "../modules/cookies/general";
import {csurfCookieGenerator,csurfChecking} from "../modules/cookies/csurf";
import {sessionChecking} from "../modules/sessionManagement/sessionChecking";
import {databaseConnectionTesting} from "../modules/sql/connectionTest";
import {notEmptyCheck} from "../modules/dataValidation/notEmpty";
import {fetchAllDatabasesInfo} from "./modules/dbManagerFetchAll";
/*Sait pas*/
//import {sqlQuery} from "../modules/sql/sqlQueries";
import {dataBaseOptions} from "../modules/sql/dbOptions";
//import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "./sqlRequests/homeRequest"
/**/
import {SqlError} from "../custom/SqlError";


const server=express();
const router=express.Router();
/*DEV*/
const {log,table}=console;
/**/


/*router.get("/",(req:Request,res:Response)=>{
    const csurfToken=tokenGenerator(50);
    const options={httpOnly: true, signed: true, sameSite: true, maxAge:600000};
    csurfCookieGenerator(req,csurfToken);
    return cookieResponse(res,200,"CSRF-TOKEN",csurfToken,options).render("home");
});*/

router.post("/sign-in",async(req:Request,res:Response)=>{
    const session=req.session;
    if(csurfChecking(session,req) && notEmptyCheck(req.body)){
        const {userName,password}=req.body;
        const dataBase=dataBaseOptions(userName,password);
        databaseConnectionTesting(server,dataBase,res,session);
    }else{
        const status=!notEmptyCheck(req.body)?400:403;
        const message=!notEmptyCheck(req.body)?"Password or username is empty":"Something wrong happened please try again";
        res.status(status).json({
            message: message
        });
    };
});

router.get("/database-manager",async(req:Request,res:Response)=>{
    const session=req.session;
    if(sessionChecking(req,session)){
        const dataBase=server.locals.db;
        const dataBases=await fetchAllDatabasesInfo(dataBase,res);
        return res.render("index",{dataBases:dataBases});
    }else{
        return res.status(403).json({message:"Something wrong happened"});
    };
});

router.get("/database-manager/:dbName",async (req: Request,res:Response):Promise<any>=>{
    const session=req.session;
    if(sessionChecking(req,session)){
        const dataBase=server.locals.db;
        const {dbName}=req.params;
        let sucess: boolean=false;
        do{
            const itExsitSqlRequest=`USE ${dbName};`;
            await dataBase.promise().query(itExsitSqlRequest)
            .then((response:any)=>sucess=true)
            .catch((err:SqlError)=>res.status(403).json({message:`${err.code}, ${err.sqlMessage}`}));
        }while(!sucess){
            dataBase.database=dbName;
            const allTableSqlRequest=`SELECT TABLE_NAME  FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA=?;`;
            const tableSizeSqlRequest=`SELECT table_name AS "Table", round(((data_length + index_length) / 1024 / 1024), 2) "table_size" FROM information_schema.TABLES WHERE table_schema= ?`;
            dataBase.query(allTableSqlRequest,[dbName],(err:SqlError,tables:Array<object>)=>{
                //table(tables)
                err?log(err):null;
                res.status(200).json(tables);
            });
        };
    }else{
        res.status(403).json({message:"Something wrong happened"})
    };
});


export default router;

//Programation fonctionelle
