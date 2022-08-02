import mysql, { Pool } from "mysql2";

export default function dataBaseOptions(userName: string, password: string, host: string = "127.0.0.1", port: number = 3306): Pool {
    return mysql.createPool({
        host: host,
        user: userName,
        password: password,
        port: port,
    });
}
