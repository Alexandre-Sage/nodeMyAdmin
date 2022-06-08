import express,{Express,Request,Response,NextFunction} from "express";
import crypto,{randomBytes} from "crypto";
import validator from "validator";
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
    }).render("home");
});

router.post("/sign-in",async (req:Request,res:Response,next:NextFunction)=>{
    const session=req.session;
    if(req.signedCookies["CSRF-TOKEN"]===session.csurfToken){
        const {isEmpty,isLength}=validator;
        const {userName,password}=req.body;
        const dataValidation= isEmpty(userName) || isEmpty(password)?false:true;
        if(dataValidation && password===process.env.DB_PASSWORD && userName===process.env.DB_USER){
            const sessionToken:string=randomBytes(75).toString('hex');
            session.sessionToken=sessionToken;
            session.save()
            res.status(200).cookie("SESS-TOKEN",sessionToken,{
                httpOnly: true,
                signed: true,
                sameSite: "strict",
                maxAge:600000,
            }).redirect("database-manager");
        }else{
            res.status(400).json({
                message:"Password or username do not match you're SQL server login"
            });
        };
    }else{
        res.status(403).json({
            message: "Something wrong happened please try again"
        });
    };
});

router.get("/database-manager",(req:Request,res:Response)=>{
    log("dbMan")
    //log(req.session);
    //log(server.locals)
    //log(req.locals)
    res.status(200).render("index")
})

export default router;
