import server from "../../../server";
import { testGetRoute, testPostRoute } from "../../testModules/httpModule.test";
import { htmlHeader200ObjCookie, assertBodyNoRedirectObj, noErrorObject, chaiAgent, clientErrorObject, jsonSqlError400Object } from "../../globalsTestVar";


export default describe("3.2) VALUES NOT MATCHING SQL LOGIN", function () {
    const chai = chaiAgent();
    it("Should raise an error for invalid password", (done) => {
        const agentObj = { agent: chai.request.agent(server) };
        const sendBody = { password: "something", userName: process.env.DB_USER };
        const propertyArray = [{ propertyName: "message", propertyValue: "Wrong password" }];
        const assertBodyObj = { redirectsLength: 0, propertyArray: propertyArray };
        testGetRoute(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
            .then(() => testPostRoute(agentObj, "/login", sendBody, jsonSqlError400Object, clientErrorObject, assertBodyObj))
            .then(() => done())
            .catch((err: Error) => done(err));
    });
    it("Should raise an eroor for invalid userName", (done) => {
        const agentObj = { agent: chai.request.agent(server) };
        const sendBody = { password: process.env.DB_PASSWORD, userName: "userName" };
        const propertyArray = [{ propertyName: "message", propertyValue: "The provided user doesn't exist." }];
        const assertBodyObj = { redirectsLength: 0, propertyArray: propertyArray };
        testGetRoute(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
            .then(() => testPostRoute(agentObj, "/login", sendBody, jsonSqlError400Object, clientErrorObject, assertBodyObj))
            .then(() => done())
            .catch((err: Error) => done(err));
    });
});
