import {SqlError} from "../../custom/SqlError";
import {Response} from "express";
export const sqlError=(err:SqlError,res:Response):Response=>{
    let message: string | undefined;
    //console.log(err)
    switch(err.code){
        case "ECONNREFUSED":
            message="Connection refused please check if mariaDb is enabled.";
            break;
        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
            message="The provided user doesn't exist.";
            break;
        case "ER_ACCESS_DENIED_ERROR":
            message="Wrong password";
            break;
        default:
            message="Something wrong happened please retry.";
    };
    //console.log(message)
    return res.status(400).json({message:message});
}
