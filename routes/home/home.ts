/*Sur pour le moment*/
import express,{Request,Response} from "express";
import {cookieResponse,tokenGenerator} from "../modules/cookies/general";
import {csurfCookieGenerator,csurfChecking} from "../modules/cookies/csurf";
import {sessionCreation} from "../modules/sessionManagement/sessionCreation";
import {databaseConnectionTesting} from "../modules/sql/connectionTest";
/*Sait pas*/
import {dataBaseOptions} from "../modules/sql/dbOptions";
/**/
/*Potentiellement a enlever*/
import {sqlError} from "../modules/sql/sqlError";
import {SqlError} from "../custom/SqlError";
import validator from "validator";
import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "./sqlRequests/homeRequest"


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

router.post("/sign-in",(req:Request,res:Response)=>{
    const session=req.session;
    const {userName,password}=req.body;
    const {isEmpty,isLength}=validator;
    const dataValidation= !(isEmpty(userName) || isEmpty(password));
    if(csurfChecking(session,req) && dataValidation){
        const dataBase=dataBaseOptions(userName,password);
        console.log("here",databaseConnectionTesting(dataBase,res));
        dataBase.getConnection((err:any | SqlError, conn:any)=>{
            if(err){
                sqlError(err,res);
            }else if(conn){
                //console.log(databaseConnectionTesting(dataBase,res));
                const sessionToken=tokenGenerator(75);
                session.csurfToken=""
                sessionCreation(server,session,dataBase,sessionToken);
                const options={httpOnly: true,signed: true, sameSite: true,maxAge:600000}
                return cookieResponse(res,200,"SESSION-TOKEN",sessionToken,options).redirect("database-manager");
            };
        });
    }else{
        const status=!dataValidation?400:403;
        const message=!dataValidation?"Password or username is empty":"Something wrong happened please try again";
        res.status(status).json({
            message: message
        });
    };
    //return response
});

router.get("/database-manager",async(req:Request,res:Response):Promise<any>=>{
    const session=req.session;
    if(req.signedCookies["SESSION-TOKEN"]===session.sessionToken){
        const dataBase=server.locals.db;
        const db:Array<object>=[];
        const dataBases= await dataBase.promise().query(allDbSqlRequest)
        .then((response:Array<object>)=>response[0])
        .catch((err:Error)=>log(err));
        for(const element of dataBases){
            const tableNumber= await dataBase.promise().query(tableNumSqlRequest(element.Database))
            .then((response:Array<object>)=>response[0])
            .catch((err:SqlError)=>log(err));
            const dbSize= await dataBase.promise().query(dbSizeSqlRequest(element.Database))
            .then((response:Array<object>)=>response[0])
            .catch((err:SqlError)=>log(err));
            db.push({dbName:element.Database,tablesNum:tableNumber[0]['COUNT(*)'],dbSize:dbSize[0]?`${dbSize[0].size_mb} MB`:"0 MB"});
        };
        res.status(200).render("index",{dataBases:db});
    }else{
        res.status(403).json({message:"Something wrong happened"});
    }
});

router.get("/database-manager/:dbName",async (req: Request,res:Response):Promise<any>=>{
    const session=req.session;
    if(req.signedCookies["SESSION-TOKEN"]===session.sessionToken){
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
