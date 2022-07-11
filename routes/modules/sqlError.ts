import {SqlError} from "../custom/sqlError";

export const sqlError=(err:SqlError,message:string)=>{
    switch(err.code){
        case "ECONNREFUSED":
            message="Connection refused please check if mariaDb is enabled."
            break;
        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
            message="The provided user doesn't exist."
            break;
        case "ER_ACCESS_DENIED_ERROR":
            message="Wrong password"
            break;
        default:
            "Something wrong happened please retry."
    };
    console.log(message)
    return message
}
