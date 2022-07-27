import {assertError,assertHeader,assertBody} from "./assertionModule.test";
import {ErrorObject,HeaderObject} from "./modulesInterfaces";

async function testGetRoute(agentObj:any,path:string,assertHeaderObj:HeaderObject,errorObject:ErrorObject){
    await agentObj.agent.get(path)
    .then((res:any)=>{
        //log(res)
        const {contentType,status,origin,cookie}=assertHeaderObj;
        const{serverError,clientError,badRequest}=errorObject;
        assertHeader(res,assertHeaderObj);
        assertError(res,errorObject);
        contentType==="application/json; charset=utf-8"?assertBody(res,0):null
    }).catch((err:Error)=>{throw err})
};

async function testPostRoute(agentObj:any,url:string,sendBody:Object,assertHeaderObj:HeaderObject,errorObject:ErrorObject){
    agentObj.agent.post(url)
    return await agentObj.agent.post("/login")
    .send(sendBody)
    .then((res:any)=>{
        const {contentType,status,origin,cookie}=assertHeaderObj;
        const{serverError,clientError,badRequest}=errorObject;
        assertHeader(res,assertHeaderObj);
        assertError(res,errorObject);
    }).catch((err:Error)=>{throw err});
}
export  {testGetRoute,testPostRoute}
