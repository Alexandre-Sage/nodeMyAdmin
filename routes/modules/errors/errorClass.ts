export interface CustomErrorInterface extends Error {
    httpStatus: number,
    message: string
}

export default class CustomError extends Error {
    httpStatus: number;
    constructor(message: string, httpStatus: number) {
        super(message);
        this.httpStatus = httpStatus;
        Error.captureStackTrace(this, this.constructor)
    }
}
