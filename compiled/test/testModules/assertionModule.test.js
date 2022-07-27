"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertBody = exports.assertHeader = exports.assertError = void 0;
const chai_1 = require("chai");
const assertHeader = (res, headerObject) => {
    (0, chai_1.expect)(res).to.have.status(headerObject.status);
    (0, chai_1.expect)(res.header["content-type"]).to.be.eql(headerObject.contentType);
    (0, chai_1.expect)(res.header).to.have.property("access-control-allow-origin").eql(headerObject.origin);
    headerObject.cookie ? (0, chai_1.expect)(res.header).to.have.property("set-cookie") : null;
};
exports.assertHeader = assertHeader;
const assertBody = (res, assertBodyObj) => {
    (0, chai_1.expect)(res.redirects).to.be.a("array");
    const { redirectsLength, propertyArray } = assertBodyObj;
    (0, chai_1.expect)(res.redirects).to.have.length(redirectsLength);
    propertyArray ? propertyArray.forEach((item) => (0, chai_1.expect)(res.body).to.have.property(item.propertyName).eql(item.propertyValue)) : null;
};
exports.assertBody = assertBody;
const assertError = (res, errorObject) => {
    const { clientError, serverError, badRequest } = errorObject;
    (0, chai_1.expect)(res.clientError).to.be.eql(clientError);
    (0, chai_1.expect)(res.serverError).to.be.eql(serverError);
    (0, chai_1.expect)(res.badRequest).to.be.eql(badRequest);
};
exports.assertError = assertError;
