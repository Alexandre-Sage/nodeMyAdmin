import chai,{request,assert,should,expect} from "chai";

export const assertHeader=(headerObject:any)=>{
//{res:Response, contentType:string, status:number}
    expect(headerObject.res).to.have.status(headerObject.status);
    expect(headerObject.res.header["content-type"]).to.be.eql(headerObject.contentType);
    expect(headerObject.res.header).to.have.property("access-control-allow-origin").eql("http://127.0.0.1:8000");
    headerObject.cookie?expect(headerObject.res.header).to.have.property("set-cookie"):null;
};

export const assertBody=()=>{

};

export const assertError=(errorObject:any)=>{
//{res:Response, serverError:boolean, clientError:boolean, badRequest:boolean}
    expect(errorObject.res.clientError).to.be.eql(errorObject.client);
    expect(errorObject.res.serverError).to.be.eql(errorObject.server);
    expect(errorObject.res.badRequest).to.be.eql(errorObject.badRequest)
    //expect(errorObject.res.error).to.be.eql(errorObject.general);
};
