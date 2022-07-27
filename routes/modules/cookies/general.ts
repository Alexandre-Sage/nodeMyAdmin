import {randomBytes} from "crypto";
import {Response} from "express";
declare interface CookieOptions extends Object{
    httpOnly: boolean,
    signed: boolean,
    sameSite: boolean | "strict" | "none" | "lax" | undefined,
    maxAge:number
};

const cookieResponse= (res:Response, status:number, cookieName:string, token:string, options:CookieOptions):Response<any>=> res.status(status).cookie(cookieName,token,options);

const tokenGenerator=(bytes:number):string=>randomBytes(bytes).toString('hex');

export {CookieOptions,cookieResponse,tokenGenerator};
