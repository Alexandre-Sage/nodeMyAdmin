"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import mocha from "mocha";
const chai_1 = __importStar(require("chai"));
const httpModule_test_1 = require("../testModules/httpModule.test");
const chai_http_1 = __importDefault(require("chai-http"));
const server_1 = __importDefault(require("../../server"));
chai_1.default.use(chai_http_1.default);
const { log, table } = console;
//{password:process.env.DB_PASSWORD,userName:process.env.DB_USER}
const htmlHeader200ObjectNoCookie = { status: 200, contentType: "text/html; charset=utf-8", cookie: false, origin: "http://127.0.0.1:8000" };
const htmlHeader200ObjCookie = { status: 200, contentType: "text/html; charset=utf-8", origin: "http://127.0.0.1:8000", cookie: true };
const jsonSqlError400Object = { status: 400, contentType: "application/json; charset=utf-8", cookie: false, origin: "http://127.0.0.1:8000" };
const assertBodyNoRedirectObj = { redirectsLength: 0 };
const assertBodyRedirectObj = { redirectsLength: 1 };
const noErrorObject = { clientError: false, serverError: false, badRequest: false };
const clientErrorObject = { clientError: true, serverError: false, badRequest: true };
exports.default = describe("CONNEXION ROUTER", () => {
    describe("1) GET THE HOME PAGE", function () {
        it("Should render the home page && get a cookie", (done) => {
            const agentObj = { agent: chai_1.default.request.agent(server_1.default) };
            (0, httpModule_test_1.testGetRoute)(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
                .then(() => done())
                .catch((err) => done(err));
        });
    });
    describe("2) POST THE LOGIN FORM", () => {
        it("Should post the login form and redirect to the dbManager", (done) => {
            const agentObj = { agent: chai_1.default.request.agent(server_1.default) };
            const sendBody = { password: process.env.DB_PASSWORD, userName: process.env.DB_USER };
            (0, httpModule_test_1.testGetRoute)(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
                .then(() => (0, httpModule_test_1.testPostRoute)(agentObj, "/login", sendBody, htmlHeader200ObjectNoCookie, noErrorObject, assertBodyRedirectObj))
                .then(() => done())
                .catch(err => done(err));
        });
    }); //
    describe("3) RAISE CONNEXION ERRORS", () => {
        describe("3.1) MISSING VALUE", () => {
            it("Should raise an error for missing csrf", (done) => {
                chai_1.default.request(server_1.default)
                    .post("/login")
                    .send({ password: process.env.DB_PASSWORD, userName: process.env.DB_USER })
                    .end((err, res) => {
                    err ? done(err) : null;
                    (0, chai_1.expect)(res).to.have.status(403);
                    done();
                });
            });
            it.only("Should raise an error for missing password", (done) => {
                const agentObj = { agent: chai_1.default.request.agent(server_1.default) };
                const sendBody = { password: "", userName: process.env.DB_USER };
                const propertyArray = [{ propertyName: "message", propertyValue: "Wrong password" }];
                const assertBodyObj = { redirectsLength: 0, propertyArray: propertyArray };
                (0, httpModule_test_1.testGetRoute)(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
                    .then(() => (0, httpModule_test_1.testPostRoute)(agentObj, "/login", sendBody, jsonSqlError400Object, clientErrorObject, assertBodyObj))
                    .then(() => done())
                    .catch((err) => done(err));
                done();
            });
            it("Should raise an error for missing userName", (done) => {
                const agentObj = { agent: chai_1.default.request.agent(server_1.default) };
                const sendBody = { password: process.env.DB_PASSWORD, userName: "process.env.DB_USER" };
                const propertyArray = [{ propertyName: "message", propertyValue: "Wrong password" }];
                const assertBodyObj = { redirectsLength: 0, propertyArray: propertyArray };
                (0, httpModule_test_1.testGetRoute)(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
                    .then(() => (0, httpModule_test_1.testPostRoute)(agentObj, "/login", sendBody, jsonSqlError400Object, clientErrorObject, assertBodyObj))
                    .then(() => done())
                    .catch((err) => done(err));
            });
        }); //////////////
        describe("3.2) VALUES NOT MATCHING SQL LOGIN", () => {
            it("Should raise an error for invalid password", (done) => {
                const agentObj = { agent: chai_1.default.request.agent(server_1.default) };
                const sendBody = { password: { password: "something", userName: process.env.DB_USER }, userName: "process.env.DB_USER" };
                const propertyArray = [{ propertyName: "message", propertyValue: "Wrong password" }];
                const assertBodyObj = { redirectsLength: 0, propertyArray: propertyArray };
                (0, httpModule_test_1.testGetRoute)(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
                    .then(() => (0, httpModule_test_1.testPostRoute)(agentObj, "/login", sendBody, jsonSqlError400Object, clientErrorObject, assertBodyObj))
                    .then(() => done())
                    .catch((err) => done(err));
                //agent.get("/")
                //.end((err,res)=>{
                //    err?done(err):null
                //    expect(res).to.have.status(200);
                //    agent.post("/login")
                //    .send({password:"something",userName:process.env.DB_USER})
                //    .end((err,res)=>{
                //        const message="Wrong password";
                //        const status=400;
                //        const contentType="application/json; charset=utf-8";
                //        err?done(err):null
                //        assertHeader({res:res,status:status,contentType:contentType,cookie:false});
                //        //assertError({res:res,client:true,server:false, badRequest:true});
                //        expect(res.body).to.have.property("message").eql(message);
                //        expect(res.badRequest).to.be.eql(true);
                //        expect(res.redirects).to.be.a("array");
                //        expect(res.redirects).to.have.length(0);
                //        done();
                //    });
                //});
            });
            /*it("Should raise an eroor for invalid userName",(done)=>{
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
            });*/
        });
    }); //
});
