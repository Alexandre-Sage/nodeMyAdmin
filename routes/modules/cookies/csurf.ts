import {Request} from "express";
import {Session} from "express-session";

export const csurfCookieGenerator=(req:Request,token:string):Session=>{
    const session:Session=req.session;
    session.csurfToken=token;
    return session.save();
};
