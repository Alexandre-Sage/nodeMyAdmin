import server from "../../../server";
import {testGetRoute, testPostRoute} from "../../testModules/httpModule.test";
import {htmlHeader200ObjectNoCookie, htmlHeader200ObjCookie, assertBodyNoRedirectObj, assertBodyRedirectObj, noErrorObject,chaiAgent} from "../../globalsTestVar";
//chai.use(chaiHttp);

export default describe("2) POST THE LOGIN FORM",function(){
    it("Should post the login form and redirect to the dbManager",(done)=>{
        const chai=chaiAgent();
        const agentObj={agent:chai.request.agent(server)};
        const sendBody={password:process.env.DB_PASSWORD,userName:process.env.DB_USER};
        testGetRoute(agentObj,"/",htmlHeader200ObjCookie,noErrorObject,assertBodyNoRedirectObj)
        .then(()=>testPostRoute(agentObj,"/login",sendBody,htmlHeader200ObjectNoCookie,noErrorObject,assertBodyRedirectObj))
        .then(()=>done())
        .catch(err=>done(err));
    });
});
