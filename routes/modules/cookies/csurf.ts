import {Request} from "express";
import {Session} from "express-session";
import CustomError from "../errors/errorClass";
const csurfCookieGenerator=(req:Request,token:string):Session=>{
    const session:Session=req.session;
    session.csurfToken=token;
    return session.save();
};

async function csurfChecking(session:Session,req:Request):Promise<Boolean | Error>{
    const error:Error=new CustomError("Csurf cookie is not valid",403)
    const requestCookie:string=req.signedCookies["CSRF-TOKEN"];
    const {csurfToken}:Session=session;
    return new Promise((resolve:Function,reject:Function):Boolean | Error=>(
        csurfToken && requestCookie===session.csurfToken?resolve(true):reject(error)
    ));
}

export {csurfCookieGenerator,csurfChecking};
