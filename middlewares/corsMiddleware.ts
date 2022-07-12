import cors from "cors";
//dotenv.config({path:path.resolve("./.env")});

console.log(process.env.PORT)
const corsMiddleware=cors({
    origin:"http://127.0.0.1:8000"/*`${process.env.HOST}${process.env.PORT}`,"http://localhost:8000"*/,
    methods: ["GET","POST"],
    credentials:true
});

export default corsMiddleware;
