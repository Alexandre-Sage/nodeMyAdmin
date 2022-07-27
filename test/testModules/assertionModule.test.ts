import chai,{request,assert,should,expect} from "chai";
import {ErrorObject,HeaderObject,BodyPropertyObj,AssertBodyObj} from "./modulesInterfaces";

 const assertHeader=(res:any,headerObject:HeaderObject)=>{
    expect(res).to.have.status(headerObject.status);
    expect(res.header["content-type"]).to.be.eql(headerObject.contentType);
    expect(res.header).to.have.property("access-control-allow-origin").eql(headerObject.origin);
    headerObject.cookie?expect(res.header).to.have.property("set-cookie"):null;
};

 const assertBody=(res:any,assertBodyObj:AssertBodyObj | any)=>{
    expect(res.redirects).to.be.a("array");
    const {redirectsLength,propertyArray}=assertBodyObj;
    expect(res.redirects).to.have.length(redirectsLength);
    propertyArray?propertyArray.forEach((item:any)=>expect(res.body).to.have.property(item.propertyName).eql(item.propertyValue)):null;
};

 const assertError=(res:any,errorObject:ErrorObject)=>{
    const {clientError,serverError,badRequest}=errorObject;
    expect(res.clientError).to.be.eql(clientError);
    expect(res.serverError).to.be.eql(serverError);
    expect(res.badRequest).to.be.eql(badRequest);
};
export {assertError,assertHeader,assertBody}
