"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionChecking = void 0;
const sessionChecking = (req, session) => (session.sessionToken && req.signedCookies["SESSION-TOKEN"] === session.sessionToken);
exports.sessionChecking = sessionChecking;
