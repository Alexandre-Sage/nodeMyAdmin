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
exports.dbManagerTest = void 0;
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const server_1 = __importDefault(require("../server"));
chai_1.default.use(chai_http_1.default);
const { log, table } = console;
const dbManagerTest = () => describe("DB MANAGER ROUTER", () => {
    describe("1) GET THE HOME PAGE AND DISPLAY ALL DATABASES", () => {
        it("Should login and fetch all the availaible DB", (done) => {
            const agent = chai_1.default.request.agent(server_1.default);
            agent.get("/")
                .end((err, res) => {
                err ? done(err) : null;
                (0, chai_1.expect)(res).to.have.status(200);
                agent.post("/sign-in")
                    .send({ password: process.env.DB_PASSWORD, userName: process.env.DB_USER })
                    .end((err, res) => {
                    err ? done(err) : null;
                    log(res);
                    (0, chai_1.expect)(res).to.have.status(200);
                    log(res.body);
                    //expect(res.body).to.have.property("dataBases");
                    done();
                });
            });
            //done(
        });
    });
});
exports.dbManagerTest = dbManagerTest;
