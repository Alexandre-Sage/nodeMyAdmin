//import mocha from "mocha";
import chai,{/*request,assert,should,*/expect} from "chai";
import {assertError,assertHeader} from "./testModule";
import chaiHttp from "chai-http";
import server from "../server";
import mysql from "mysql2";
chai.use(chaiHttp);
const {log,table}=console;

export const dbManagerTest=()=>describe("DB MANAGER ROUTER",()=>{
    describe("1) GET THE HOME PAGE AND DISPLAY ALL DATABASES",()=>{
        it("Should login and fetch all the availaible DB",(done)=>{

            const agent=chai.request.agent(server);
            agent.get("/")
            .end((err,res)=>{
                err?done(err):null
                expect(res).to.have.status(200);
                agent.post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    log(server.locals.db)
                    err?done(err):null
                    expect(res).to.have.status(200);
                    done()
                    agent.close();
                });
            });
        });
    });
    describe("2) GET ALL TABLE OF ONE DATABASE ",()=>{
        it("Should get all test_one's tables",(done)=>{
            const agent=chai.request.agent(server);
            agent.get("/")
            .end((err,res)=>{
                err?done(err):null
                expect(res).to.have.status(200);
                agent.post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.get("/database-manager/test_one")
                    .end((err:Error,res:any)=>{
                        err?done(err):null;
                        const status=200;
                        const contentType="application/json; charset=utf-8";
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,server:false, client:false, badRequest:false});
                        expect(res).to.be.json;
                        expect(res.body).to.be.a("array")
                        expect(res.body).to.have.length(3)
                        agent.close();
                        done()
                    });
                });
            });
        });
    });
    describe("3) SHOULD RAISE UNKNOW DB ERROR",()=>{
        it("Get a unknow database",(done)=>{
            const agent=chai.request.agent(server);
            agent.get("/")
            .end((err,res)=>{
                err?done(err):null
                expect(res).to.have.status(200);
                agent.post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.get("/database-manager/some_db")
                    .end((err:Error,res:any)=>{
                        err?done(err):null;
                        const status=403;
                        const contentType="application/json; charset=utf-8";
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,server:false, client:true, badRequest:false});
                        expect(res).to.be.json;
                        expect(res.body).to.be.a("object");
                        expect(res.body).to.have.property("message");
                        done();
                        agent.close();
                    });
                });
            });
        });
    });
});
//TEST END TO END AND CYPRESS
