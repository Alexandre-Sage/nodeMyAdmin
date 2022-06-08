"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const server_1 = __importDefault(require("../server"));
chai_1.default.use(chai_http_1.default);
const { log, table } = console;
/*describe("Describe something",()=>{
    it("Do something",()=>{

    });
});*/
describe("Describe somethign", () => {
    describe("Describe something", () => {
        it("Do something", () => {
            chai_1.default.request(server_1.default)
                .get("/")
                .end((err, res) => {
                err ? done(err) : null;
                log(res);
            });
        });
    });
});
