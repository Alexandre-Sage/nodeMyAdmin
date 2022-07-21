import validator from "validator";
import {Request,Response,NextFunction as Next} from "express"
const notEmptyCheck=(req:Request,res:Response,next:Next)=>{
    console.log("ok")
    if(req.method==="POST"){
        let validationCount=0;
        const {isEmpty,isLength}=validator;
        const requestBody:Array<any>=Object.entries(req.body)
        for(const item of requestBody){
            const [key,value]=item;
            if(isEmpty(value) && !isLength(value,{min:2})) break;
            else validationCount++;
        };
        console.assert(validationCount===requestBody.length,"no")
        validationCount===requestBody.length?next(req.url):res.status(400).json({message:"Password or username is empty"})/*next(console.log("somethinf empty"))*/ //res.status(400).json({message:"Password or username is empty"})
    }else{
        next()
    }
};
export default notEmptyCheck;
