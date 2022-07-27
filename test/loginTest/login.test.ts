//import mocha from "mocha";
import chai,{request,assert,should,expect} from "chai";
import {assertError,assertHeader,assertBody} from "../testModules/assertionModule.test";
import {ErrorObject} from "../testModules/modulesInterfaces";
import {testGetRoute, testPostRoute} from "../testModules/httpModule.test";

import chaiHttp,{} from "chai-http";
import server from "../../server";
import {Response} from "express";
chai.use(chaiHttp);
const {log,table}=console;
//{password:process.env.DB_PASSWORD,userName:process.env.DB_USER}




export default describe("CONNEXION ROUTER",()=>{
    describe("1) GET THE HOME PAGE",function(){
        it.only("Should render the home page && get a cookie",(done)=>{
            const agentObj={agent:chai.request.agent(server)};
            const assertHeaderObj={status:200,contentType:"text/html; charset=utf-8",origin:"http://127.0.0.1:8000",cookie:true};
            const assertErrorObject={clientError:false,serverError:false,badRequest:false};
            testGetRoute(agentObj,"/",assertHeaderObj,assertErrorObject)
            .then(()=>done())
            .catch((err:Error)=>done(err));
        });
    });
    describe("2) POST THE LOGIN FORM",()=>{
        it.only("Should post the login form and redirect to the dbManager",(done)=>{
            const agentObj={agent:chai.request.agent(server)};

            const getAssertHeaderObj={status:200,contentType:"text/html; charset=utf-8",origin:"http://127.0.0.1:8000",cookie:true};
            const getAssertErrorObject={clientError:false,serverError:false,badRequest:false};

            const loginAssertErrorObject={clientError:false,serverError:false,badRequest:false};
            const loginAssertHeaderObject={status:200,contentType:"text/html; charset=utf-8",cookie:false,origin:"http://127.0.0.1:8000"};
            const sendBody={password:process.env.DB_PASSWORD,userName:process.env.DB_USER};

            testGetRoute(agentObj,"/",getAssertHeaderObj,getAssertErrorObject)
            .then(()=>testPostRoute(agentObj,"/login",sendBody,loginAssertHeaderObject,loginAssertErrorObject))
            .then(()=>done())
            .catch(err=>done(err))
        });
    });//
    describe("3) RAISE CONNEXION ERRORS",()=>{
        /*describe("3.1) MISSING VALUE",()=>{
            it("Should raise an error for missing csrf",()=>{
                chai.request(server)
                .post("/login")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err:any,res:any)=>{
                    expect(res).to.have.status(403)
                });
            });
            it("Should raise an error for missing password",(done)=>{
                const agent=chai.request.agent(server);
                const loginErrorObject={clientError:true,serverError:false, badRequest:true};
                const sendBody={password:"",userName:process.env.DB_USER};
                agent.get("/")
                .end((err,res)=>{
                    log(res)
                    err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/login")
                    .send({password:"",userName:process.env.DB_USER})
                    .end((err,res)=>{
                        log("here")
                        log(res)
                        const message="Password or username is empty";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        //err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        assertError(res,{clientError:true,serverError:false, badRequest:true});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done()
                    });
                });
                done()
            });
            it("Should raise an error for missing userName",(done)=>{
                const agent=chai.request.agent(server);
                agent.get("/")
                .then((res)=>{
                    //err?done(err):null
                    expect(res).to.have.status(200);
                    agent.post("/login")
                    .send({password:process.env.DB_PASSWORD,userName:""})
                    .end((err,res)=>{
                        const message="Password or username is empty";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        //assertError(res,{clientError:true,serverError:false, badRequest:true});
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
                    agent.post("/login")
                    .send({password:"something",userName:process.env.DB_USER})
                    .end((err,res)=>{
                        const message="Wrong password";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        //assertError({res:res,client:true,server:false, badRequest:true});
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
                    agent.post("/login")
                    .send({password:process.env.DB_PASSWORD,userName:"userName"})
                    .end((err,res)=>{
                        const message="The provided user doesn't exist.";
                        const status=400;
                        const contentType="application/json; charset=utf-8";
                        err?done(err):null;
                        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                        //assertError({res:res,client:true,server:false, badRequest:true});
                        expect(res.body).to.have.property("message").eql(message);
                        expect(res.badRequest).to.be.eql(true);
                        expect(res.redirects).to.be.a("array");
                        expect(res.redirects).to.have.length(0);
                        done()
                    });
                });
            });
        });*/
    });//
});
