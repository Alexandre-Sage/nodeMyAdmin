import server from "../../../server";
import { testGetRoute, testPostRoute } from "../../testModules/httpModule.test";
import { htmlHeader200ObjCookie, assertBodyNoRedirectObj, noErrorObject, chaiAgent } from "../../globalsTestVar";

export default describe("1) GET THE HOME PAGE", function () {
    const chai = chaiAgent();
    it("Should render the home page && get a cookie", (done) => {
        const agentObj = { agent: chai.request.agent(server) };
        testGetRoute(agentObj, "/", htmlHeader200ObjCookie, noErrorObject, assertBodyNoRedirectObj)
            .then(() => done())
            .catch((err: Error) => done(err));
    });
});
