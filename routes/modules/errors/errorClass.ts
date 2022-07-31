export default class CustomError extends Error{
    httpStatus:number;
    constructor(message:string, httpStatus:number){
        super(message);
        this.httpStatus=httpStatus;
        Error.captureStackTrace(this, this.constructor)
    }
}
