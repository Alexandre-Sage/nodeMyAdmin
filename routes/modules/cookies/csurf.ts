import {Request} from "express";
import {Session} from "express-session";

const csurfCookieGenerator=(req:Request,token:string):Session=>{
    const session:Session=req.session;
    session.csurfToken=token;
    return session.save();
};

const csurfChecking=(session:Session,req:Request)=>session.csurfToken && req.signedCookies["CSRF-TOKEN"]===session.csurfToken;

export {csurfCookieGenerator,csurfChecking};
