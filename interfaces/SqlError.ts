export interface SqlError{
    code:string,
    errno:number,
    sqlState:string,
    sqlMessage:string,
    sql: string | undefined
};
/*export type SqlError={
    code:string,
    errno:number,
    sqlState:string,
    sqlMessage:string,
    sql: any | undefined
};*/
