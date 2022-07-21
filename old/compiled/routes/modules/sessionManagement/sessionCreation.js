"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCreation = void 0;
const sessionCreation = (server, session, dataBase, sessionToken) => {
    session.sessionToken = sessionToken;
    session.save();
    server.locals.db = dataBase;
};
exports.sessionCreation = sessionCreation;
