const  mysql=require("mysql2");
const {log,table}=console
sqlServer=mysql.createConnection({
  host:"127.0.0.1",
  user:"phpmyadmin",
  password:"root",
  port:3306
});
sqlServer.connect((err,res)=>{
  log(err,res);
});
sqlServer.query("SHOW DATABASES",((err,res)=>{
  err?log(err):null;
  table(res)
}));
