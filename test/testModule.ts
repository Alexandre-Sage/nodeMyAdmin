import chai,{request,assert,should,expect} from "chai";

export const assertHeader=(headerObject:any)=>{
    expect(headerObject.res).to.have.status(headerObject.status);
    expect(headerObject.res.header["content-type"]).to.be.eql(headerObject.contentType);
    expect(headerObject.res.header).to.have.property("access-control-allow-origin").eql("http://127.0.0.1:8000");
    headerObject.cookie?expect(headerObject.res.header).to.have.property("set-cookie"):null;
};

export const assertError=(errorObject:any)=>{
//{serverError:boolean, clientError:boolean}
    expect(errorObject.res.clientError).to.be.eql(errorObject.client);
    expect(errorObject.res.serverError).to.be.eql(errorObject.server);
    //expect(errorObject.res.error).to.be.eql(errorObject.general);
};
