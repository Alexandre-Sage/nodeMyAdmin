"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCreation = void 0;
const sessionCreation = (req, server, session, dataBase, sessionToken) => {
    console.log("before", req.app.locals.db);
    session.sessionToken = sessionToken;
    session.save();
    return req.app.locals.db = dataBase;
    //console.log(server.locals.db)
};
exports.sessionCreation = sessionCreation;
