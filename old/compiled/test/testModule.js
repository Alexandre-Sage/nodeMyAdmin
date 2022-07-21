"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertError = exports.assertBody = exports.assertHeader = void 0;
const chai_1 = require("chai");
const assertHeader = (headerObject) => {
    //{res:Response, contentType:string, status:number}
    (0, chai_1.expect)(headerObject.res).to.have.status(headerObject.status);
    (0, chai_1.expect)(headerObject.res.header["content-type"]).to.be.eql(headerObject.contentType);
    (0, chai_1.expect)(headerObject.res.header).to.have.property("access-control-allow-origin").eql("http://127.0.0.1:8000");
    headerObject.cookie ? (0, chai_1.expect)(headerObject.res.header).to.have.property("set-cookie") : null;
};
exports.assertHeader = assertHeader;
const assertBody = () => {
};
exports.assertBody = assertBody;
const assertError = (errorObject) => {
    //{res:Response, serverError:boolean, clientError:boolean, badRequest:boolean}
    (0, chai_1.expect)(errorObject.res.clientError).to.be.eql(errorObject.client);
    (0, chai_1.expect)(errorObject.res.serverError).to.be.eql(errorObject.server);
    (0, chai_1.expect)(errorObject.res.badRequest).to.be.eql(errorObject.badRequest);
    //expect(errorObject.res.error).to.be.eql(errorObject.general);
};
exports.assertError = assertError;
