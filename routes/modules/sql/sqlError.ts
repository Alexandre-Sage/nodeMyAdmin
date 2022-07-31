import {SqlError} from "../../../interfaces/SqlError";
import CustomError from "../errors/errorClass";
//import {DatabaseError} from "mysql2"
export default function sqlError(err:SqlError):CustomError{
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
    return new CustomError(message,400)
    //return res.status(400).json({message:message});
};
