import express,{Request,Response} from "express";
import {SqlError} from "../custom/SqlError";
import validator from "validator";
import mysql from "mysql2";
import {allDbSqlRequest,tableNumSqlRequest,dbSizeSqlRequest} from "./sqlRequests/homeRequest"
import {cookieResponse,tokenGenerator} from "../modules/cookies/general";
import {csurfCookieGenerator} from "../modules/cookies/csurf";
import {randomBytes} from "crypto";
const server=express();
const router=express.Router();
/*DEV*/
const {log,table}=console;
/**/


router.get("/",(req:Request,res:Response)=>{
    const csurfToken=tokenGenerator(50);
    csurfCookieGenerator(req,csurfToken);
    const options={httpOnly: true, signed: true, sameSite: true, maxAge:600000};
    return cookieResponse(res,200,"CSRF-TOKEN",csurfToken,options).render("home");
});

router.post("/sign-in",async (req:Request,res:Response)=>{
    const session=req.session;
    if(session.csurfToken && req.signedCookies["CSRF-TOKEN"]===session.csurfToken){
        const {isEmpty,isLength}=validator;
        const {userName,password}=req.body;
        const dataValidation= !(isEmpty(userName) || isEmpty(password));
        if(dataValidation){
            const dataBase=mysql.createPool({
                host:"127.0.0.1",
                user:userName,
                password:password,
                port:3306,
            });
            dataBase.getConnection((err:any | SqlError,conn:any)=>{
                if(err){
                    let message:string | undefined;
                    switch(err.code){
                        case "ECONNREFUSED":
                            message="Connection refused please check if mariaDb is enabled."
                            break;
                        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
                            message="The provided user doesn't exist."
                            break;
                        case "ER_ACCESS_DENIED_ERROR":
                            message="Wrong password"
                            break;
                        default:
                            "Something wrong happened please retry."
                    };
                    res.status(400).json({
                        message:message
                    });
                }else if(conn){
                    const sessionToken:string=randomBytes(75).toString('hex');
                    session.csurfToken=""
                    session.sessionToken=sessionToken;
                    session.save();
                    server.locals.db=dataBase;
                    res.status(200).cookie("SESSION-TOKEN",sessionToken,{
                        httpOnly: true,
                        signed: true,
                        sameSite: "strict",
                        maxAge:600000,
                    }).redirect("database-manager");
                };
            });
        }else{
            res.status(400).json({
                message:"Password or username is empty"
            });

        };
    }else{
        res.status(403).json({
            message: "Something wrong happened please try again"
        });
    };
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
