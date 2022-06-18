"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertError = exports.assertHeader = void 0;
const chai_1 = require("chai");
const assertHeader = (headerObject) => {
    (0, chai_1.expect)(headerObject.res).to.have.status(headerObject.status);
    (0, chai_1.expect)(headerObject.res.header["content-type"]).to.be.eql(headerObject.contentType);
    (0, chai_1.expect)(headerObject.res.header).to.have.property("access-control-allow-origin").eql("http://127.0.0.1:8000");
    headerObject.cookie ? (0, chai_1.expect)(headerObject.res.header).to.have.property("set-cookie") : null;
};
exports.assertHeader = assertHeader;
const assertError = (errorObject) => {
    //{serverError:boolean, clientError:boolean}
    (0, chai_1.expect)(errorObject.res.clientError).to.be.eql(errorObject.client);
    (0, chai_1.expect)(errorObject.res.serverError).to.be.eql(errorObject.server);
    //expect(errorObject.res.error).to.be.eql(errorObject.general);
};
exports.assertError = assertError;
