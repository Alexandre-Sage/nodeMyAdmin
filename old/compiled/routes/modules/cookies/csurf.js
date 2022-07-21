"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csurfChecking = exports.csurfCookieGenerator = void 0;
const csurfCookieGenerator = (req, token) => {
    const session = req.session;
    session.csurfToken = token;
    return session.save();
};
exports.csurfCookieGenerator = csurfCookieGenerator;
const csurfChecking = (session, req) => session.csurfToken && req.signedCookies["CSRF-TOKEN"] === session.csurfToken;
exports.csurfChecking = csurfChecking;
