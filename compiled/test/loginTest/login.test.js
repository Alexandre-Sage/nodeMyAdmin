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
function test(path, status, contentType, done) {
    chai_1.default.request(server_1.default)
        .get("/")
        .end((err, res) => {
        err ? done(err) : null;
        (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: true });
        (0, httpModule_test_1.assertError)({ res: res, client: false, server: false, badRequest: false });
        done();
    });
}
exports.default = describe("CONNEXION ROUTER", () => {
    describe.only("1) GET THE HOME PAGE", () => {
        it("Should render the home page && get a cookie", (done) => {
            test("/", 200, "text/html; charset=utf-8", done);
        });
    });
    describe.only("2) POST THE LOGIN FORM", () => {
        it("Should post the login form and redirect to the dbManager", (done) => {
            const agent = chai_1.default.request.agent(server_1.default);
            agent.get("/")
                .end((err, res) => {
                err ? log(err) : null;
                (0, chai_1.expect)(res).to.have.status(200);
                agent.post("/login")
                    .send({ password: process.env.DB_PASSWORD, userName: process.env.DB_USER })
                    .end((err, res) => {
                    err ? done(err) : null;
                    const status = 200;
                    const contentType = "text/html; charset=utf-8";
                    //console.log(res)
                    (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: false });
                    (0, httpModule_test_1.assertError)({ res: res, client: false, server: false, badRequest: false });
                    (0, chai_1.expect)(res.redirects).to.be.a("array");
                    (0, chai_1.expect)(res.redirects).to.have.length(1);
                    done();
                });
            });
        });
    }); //
    describe("3) RAISE CONNEXION ERRORS", () => {
        describe("3.1) MISSING VALUE", () => {
            it("Should raise an error for missing csrf", () => {
                chai_1.default.request(server_1.default)
                    .post("/sign-in")
                    .send({ password: process.env.DB_PASSWORD, userName: process.env.DB_USER })
                    .end((err, res) => {
                    (0, chai_1.expect)(res).to.have.status(403);
                });
            });
            it("Should raise an error for missing password", (done) => {
                const agent = chai_1.default.request.agent(server_1.default);
                agent.get("/")
                    .end((err, res) => {
                    err ? done(err) : null;
                    (0, chai_1.expect)(res).to.have.status(200);
                    agent.post("/sign-in")
                        .send({ password: "", userName: process.env.DB_USER })
                        .end((err, res) => {
                        const message = "Password or username is empty";
                        const status = 400;
                        const contentType = "application/json; charset=utf-8";
                        err ? done(err) : null;
                        (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: false });
                        (0, httpModule_test_1.assertError)({ res: res, client: true, server: false, badRequest: true });
                        (0, chai_1.expect)(res.body).to.have.property("message").eql(message);
                        (0, chai_1.expect)(res.badRequest).to.be.eql(true);
                        (0, chai_1.expect)(res.redirects).to.be.a("array");
                        (0, chai_1.expect)(res.redirects).to.have.length(0);
                        done();
                    });
                });
            });
            it("Should raise an error for missing userName", (done) => {
                const agent = chai_1.default.request.agent(server_1.default);
                agent.get("/")
                    .end((err, res) => {
                    err ? done(err) : null;
                    (0, chai_1.expect)(res).to.have.status(200);
                    agent.post("/sign-in")
                        .send({ password: process.env.DB_PASSWORD, userName: "" })
                        .end((err, res) => {
                        const message = "Password or username is empty";
                        const status = 400;
                        const contentType = "application/json; charset=utf-8";
                        err ? done(err) : null;
                        (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: false });
                        (0, httpModule_test_1.assertError)({ res: res, client: true, server: false, badRequest: true });
                        (0, chai_1.expect)(res.body).to.have.property("message").eql(message);
                        (0, chai_1.expect)(res.badRequest).to.be.eql(true);
                        (0, chai_1.expect)(res.redirects).to.be.a("array");
                        (0, chai_1.expect)(res.redirects).to.have.length(0);
                        done();
                    });
                });
            });
        }); //////////////
        describe("3.2) VALUES NOT MATCHING SQL LOGIN", () => {
            it("Should raise an error for invalid password", (done) => {
                const agent = chai_1.default.request.agent(server_1.default);
                agent.get("/")
                    .end((err, res) => {
                    err ? done(err) : null;
                    (0, chai_1.expect)(res).to.have.status(200);
                    agent.post("/sign-in")
                        .send({ password: "something", userName: process.env.DB_USER })
                        .end((err, res) => {
                        const message = "Wrong password";
                        const status = 400;
                        const contentType = "application/json; charset=utf-8";
                        err ? done(err) : null;
                        (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: false });
                        (0, httpModule_test_1.assertError)({ res: res, client: true, server: false, badRequest: true });
                        (0, chai_1.expect)(res.body).to.have.property("message").eql(message);
                        (0, chai_1.expect)(res.badRequest).to.be.eql(true);
                        (0, chai_1.expect)(res.redirects).to.be.a("array");
                        (0, chai_1.expect)(res.redirects).to.have.length(0);
                        done();
                    });
                });
            });
            it("Should raise an eroor for invalid userName", (done) => {
                const agent = chai_1.default.request.agent(server_1.default);
                agent.get("/")
                    .end((err, res) => {
                    err ? done(err) : null;
                    (0, chai_1.expect)(res).to.have.status(200);
                    agent.post("/sign-in")
                        .send({ password: process.env.DB_PASSWORD, userName: "userName" })
                        .end((err, res) => {
                        const message = "The provided user doesn't exist.";
                        const status = 400;
                        const contentType = "application/json; charset=utf-8";
                        err ? done(err) : null;
                        (0, httpModule_test_1.assertHeader)({ res: res, status: status, contentType: contentType, cookie: false });
                        (0, httpModule_test_1.assertError)({ res: res, client: true, server: false, badRequest: true });
                        (0, chai_1.expect)(res.body).to.have.property("message").eql(message);
                        (0, chai_1.expect)(res.badRequest).to.be.eql(true);
                        (0, chai_1.expect)(res.redirects).to.be.a("array");
                        (0, chai_1.expect)(res.redirects).to.have.length(0);
                        done();
                    });
                });
            });
        });
    }); //
});
