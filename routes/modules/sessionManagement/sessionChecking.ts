import {Session} from "express-session";
import {Request} from "express";
import CustomError from "../errors/errorClass";

export default function sessionChecking(req:Request,session:Session):Promise<boolean | Error>{
    const error=new CustomError("Something went wrong during session check.",403);
    return new Promise((resolve, reject) => (
        session.sessionToken && req.signedCookies["SESSION-TOKEN"]===session.sessionToken?resolve(true):reject(error)
    ));
}