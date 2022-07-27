"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPostRoute = exports.testGetRoute = void 0;
const assertionModule_test_1 = require("./assertionModule.test");
const { log } = console;
function testGetRoute(agentObj, path, assertHeaderObj, errorObject, assertBodyObj) {
    return __awaiter(this, void 0, void 0, function* () {
        yield agentObj.agent.get(path)
            .then((res) => {
            //log(res)
            const { contentType, status, origin, cookie } = assertHeaderObj;
            const { serverError, clientError, badRequest } = errorObject;
            (0, assertionModule_test_1.assertHeader)(res, assertHeaderObj);
            (0, assertionModule_test_1.assertError)(res, errorObject);
            (0, assertionModule_test_1.assertBody)(res, assertBodyObj);
        }).catch((err) => { throw err; });
    });
}
exports.testGetRoute = testGetRoute;
;
function testPostRoute(agentObj, url, sendBody, assertHeaderObj, errorObject, assertBodyObj) {
    return __awaiter(this, void 0, void 0, function* () {
        agentObj.agent.post(url);
        return yield agentObj.agent.post("/login")
            .send(sendBody)
            .then((res) => {
            //log(res)
            const { contentType, status, origin, cookie } = assertHeaderObj;
            const { serverError, clientError, badRequest } = errorObject;
            (0, assertionModule_test_1.assertHeader)(res, assertHeaderObj);
            (0, assertionModule_test_1.assertError)(res, errorObject);
            (0, assertionModule_test_1.assertBody)(res, assertBodyObj);
        }).catch((err) => { throw err; });
    });
}
exports.testPostRoute = testPostRoute;
