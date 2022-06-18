import express,{Request,Response,NextFunction} from "express";
import crypto,{randomBytes} from "crypto";
import validator from "validator";
import mysql from "mysql2"
const server=express()
const router = express.Router();


/*DEV*/
const {log,table}=console;


/*router.get("/",function(req:Request,res:Response,next:NextFunction){
    console.log(req.session);
    res.status(200).json({message:"Hello World"})
});*/

router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    const csurfToken:string=crypto.randomBytes(50).toString('hex');
    const session:any=req.session;
    session.csurfToken=csurfToken;
    session.save();
    res.status(200).cookie("CSRF-TOKEN",csurfToken,{
        httpOnly: true,
        signed: true,
        sameSite: "strict",
        maxAge:600000
    }).render("home");
});
router.post("/sign-in",async (req:Request,res:Response,next:NextFunction)=>{
    //log(req.body)
    const session=req.session;
    if(req.signedCookies["CSRF-TOKEN"]===session.csurfToken && session.csurfToken){
        const {isEmpty,isLength}=validator;
        const {userName,password}=req.body;
        const dataValidation= isEmpty(userName) || isEmpty(password)?false:true;
        if(dataValidation){
            const dataBase=mysql.createPool({
                host:"127.0.0.1",
                user:userName,
                password:password,
                port:3306,
            });
            dataBase.getConnection((err:any,conn:any)=>{
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
        log(req.signedCookies)
        res.status(403).json({
            message: "Something wrong happened please try again"
        });

    };
});

router.get("/database-manager",async(req:Request,res:Response)=>{
    const session=req.session;
    if(req.signedCookies["SESSION-TOKEN"]===session.sessionToken){
        const dataBase=server.locals.db;
        const allDbSqlRequest="SHOW DATABASES";
        const db:Array<object>=[];
        const dataBases= await dataBase.promise().query(allDbSqlRequest)
        for(const element of dataBases[0]){
            const tableNumSqlRequest=`SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${element.Database}";`;
            const dbSizeSqlRequest=`SELECT table_schema "${element.Database}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${element.Database}' GROUP BY table_schema;`;
            const tableNumber= await dataBase.promise().query(tableNumSqlRequest)
            .then((response:Array<object>)=>response[0]);
            const dbSize= await dataBase.promise().query(dbSizeSqlRequest)
            .then((response:Array<object>)=>response[0]);
            const test={dbName:element.Database,tablesNum:tableNumber[0]['COUNT(*)'],dbSize:dbSize[0]?`${dbSize[0].size_mb} MB`:"0 MB"}
            log(test)
            db.push({dbName:element.Database,tablesNum:tableNumber[0]['COUNT(*)'],dbSize:dbSize[0]?`${dbSize[0].size_mb} MB`:"0 MB"});
        };
        res.status(200).render("index",{dataBases:db});
    }else{
        res.status(403).json({message:"Something wrong happened"});
    }
});

router.get("/database-manager/:dbName",(req:Request,res:Response)=>{
    const session=req.session;
    if(req.signedCookies["SESSION-TOKEN"]===session.sessionToken){
        log(req.params)
        const dataBase=server.locals.db;
        dataBase.databse=req.params.dbName;
        const allTableSqlRequest=`SELECT TABLE_NAME  FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA=?;`;
        dataBase.query(allTableSqlRequest,[req.params.dbName],(err:any,tables:Array<object>)=>{
            err?log(err):null;
            res.status(200).json(tables);
        });
    }else{
        res.status(403).json({message:"Something wrong happened"})
    };
});
export default router;
