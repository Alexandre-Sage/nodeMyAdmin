import server from "../../../../server";
import { testGetRoute, testPostRoute } from "../../../testModules/httpModule.test";
import { jsonHeader200ObjectNoCookie, htmlHeader200ObjCookie, assertBodyNoRedirectObj, assertBodyRedirectObj, noErrorObject, chaiAgent } from "../../../globalsTestVar";

const { log, table } = console;
export default describe("SHOULD GET A DB AND DISPLAY TABLES", function () {
    it("should get the database", async () => {
        const chai = chaiAgent();
        const agentObj = { agent: chai.request.agent(server) };
        const sendBody = { password: process.env.DB_PASSWORD, userName: process.env.DB_USER };
        try {
            await testGetRoute(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
            await testPostRoute(agentObj, "/login", sendBody, htmlHeader200ObjCookie, noErrorObject, assertBodyRedirectObj)
            await testGetRoute(agentObj, "/database-manager/test_one", jsonHeader200ObjectNoCookie, noErrorObject, assertBodyNoRedirectObj)
        } catch (err) {
            throw err
        };
    });
});
