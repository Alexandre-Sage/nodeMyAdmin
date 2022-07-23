import {Session} from "express-session";
import {Request} from "express";

export const sessionChecking=(req:Request,session:Session)=>(session.sessionToken && req.signedCookies["SESSION-TOKEN"]===session.sessionToken);
