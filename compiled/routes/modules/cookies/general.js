"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGenerator = exports.cookieResponse = void 0;
const crypto_1 = require("crypto");
;
const cookieResponse = (res, status, cookieName, token, options) => res.status(status).cookie(cookieName, token, options);
exports.cookieResponse = cookieResponse;
const tokenGenerator = (bytes) => (0, crypto_1.randomBytes)(bytes).toString('hex');
exports.tokenGenerator = tokenGenerator;
