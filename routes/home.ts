import express,{Express,Request,Response,NextFunction} from "express";
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
                    //return next()
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
                    //return next()
                }
            });
        }else{
            res.status(400).json({
                message:"Password or username is empty"
            });
            //return next()
        };
    }else{
        log(req.signedCookies)
        res.status(403).json({
            message: "Something wrong happened please try again"
        });

        //return next()
    };
});

router.get("/database-manager",async(req:Request,res:Response)=>{
    const session=req.session;
    const dataBase=server.locals.db;
    const allDbSqlRequest="SHOW DATABASES";
    const db:Array<object>=[]
    const  dataBases= await dataBase.promise().query(allDbSqlRequest)
    for(const element of dataBases[0]){
        const tableNumSqlRequest=`SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${element.Database}";`
        const tableNumber= await dataBase.promise().query(tableNumSqlRequest);
        db.push({dbName:element.Database,tablesNum:tableNumber[0][0]['COUNT(*)']});
    }
    res.status(200).render("index",{dataBases:db})
});

export default router;
