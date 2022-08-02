import server from "../../../server";
import { testGetRoute, testPostRoute } from "../../testModules/httpModule.test";
import { htmlHeader200ObjectNoCookie, htmlHeader200ObjCookie, assertBodyNoRedirectObj, assertBodyRedirectObj, noErrorObject, chaiAgent } from "../../globalsTestVar";


export default describe("SHOULD GET THE DATABASE MANAGER AND DISPLAY ALL DB", function () {
    it("should get the all database", function (done) {
        const chai = chaiAgent();
        const agentObj = { agent: chai.request.agent(server) };
        const sendBody = { password: process.env.DB_PASSWORD, userName: process.env.DB_USER };
        testGetRoute(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
            .then(() => testPostRoute(agentObj, "/login", sendBody, htmlHeader200ObjCookie, noErrorObject, assertBodyRedirectObj))
            .then(() => testGetRoute(agentObj, "/database-manager", htmlHeader200ObjectNoCookie, noErrorObject, assertBodyNoRedirectObj))
            .then(() => done())
            .catch(err => done(err));
    });
});