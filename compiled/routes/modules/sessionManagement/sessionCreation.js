"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCreation = void 0;
const sessionCreation = (req, server, session, dataBase, sessionToken) => {
    session.sessionToken = sessionToken;
    session.save();
    return req.app.locals.db = dataBase;
};
exports.sessionCreation = sessionCreation;
