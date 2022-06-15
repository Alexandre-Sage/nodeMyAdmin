import mocha from "mocha";
import chai,{request,assert,should,expect} from "chai";
import {assertError,assertHeader} from "./testModule";
import chaiHttp from "chai-http";
import server from "../server";
chai.use(chaiHttp);
const {log,table}=console;
export const homeTest=()=>describe("CONNEXION ROUTER",()=>{
    describe("1) GET THE HOME PAGE",()=>{
        it("Should render the home page && get a cookie",(done)=>{
            chai.request(server)
            .get("/")
            .end((err:Error,res:any)=>{
                const status=200;
                const contentType="text/html; charset=utf-8";
                err?done(err):null;
                assertHeader({res:res,status:status,contentType:contentType,cookie:true})
                assertError({res:res,client:false,server:false,general:false});
                done();
            });
        });
    });
    describe("2) POST THE LOGIN FORM",()=>{
        it("Should post the login form and redirect to the dbManager",(done)=>{
            const agent=chai.request.agent(server);
            agent.get("/")
            .end((err,res)=>{
                err?log(err):null
                expect(res).to.have.status(200);
                agent.post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    err?done(err):null
                    const status=200;
                    const contentType="text/html; charset=utf-8";
                    assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                    assertError({res:res,client:false,server:false,general:false});
                    expect(res.redirects).to.be.a("array");
                    expect(res.redirects).to.have.length(1);
                    done()
                });
            });
        });
    });//
    describe("3) RAISE CONNEXION ERRORS",()=>{
        describe("3.1) MISSING VALUE",()=>{
            it("Should raise an error for missing csrf",()=>{
                chai.request(server)
                .post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    expect(res).to.have.status(403)
                });
            });
            it("Should raise an error for missing password",(done)=>{
                const agent=chai.request.agent(server);
                agent.get("/")
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/sign-in")
                    .send({password:"",userName:process.env.DB_USER})
                    .end((err,res)=>{
                        const message="Password or username is empty";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,client:true,server:false});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.badRequest).to.be.eql(true);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done()
                    });
                });
            });
            it("Should raise an error for missing userName",(done)=>{
                const agent=chai.request.agent(server);
                agent.get("/")
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/sign-in")
                    .send({password:process.env.DB_PASSWORD,userName:""})
                    .end((err,res)=>{
                        const message="Password or username is empty";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,client:true,server:false});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.badRequest).to.be.eql(true);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done()
                    });
                });
            });
        });//////////////
        describe("3.2) VALUES NOT MATCHING SQL LOGIN",()=>{
            it("Should raise an error for invalid password",(done)=>{
                const agent=chai.request.agent(server);
                agent.get("/")
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/sign-in")
                    .send({password:"something",userName:process.env.DB_USER})
                    .end((err,res)=>{
                        const message="Wrong password";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,client:true,server:false});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.badRequest).to.be.eql(true);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done();
                    });
                });
            });
            it("Should raise an eroor for invalid userName",(done)=>{
                const agent=chai.request.agent(server);
                agent.get("/")
                .end((err,res)=>{
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/sign-in")
                    .send({password:process.env.DB_PASSWORD,userName:"userName"})
                    .end((err,res)=>{
                        const message="The provided user doesn't exist.";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null;
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError({res:res,client:true,server:false});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.badRequest).to.be.eql(true);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done()
                    });
                });
            });
        });
    });//
});
