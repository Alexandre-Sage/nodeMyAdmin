"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function connectToDatabase(dataBase) {
    return new Promise((resolve, reject) => dataBase.getConnection((err, conn) => err ? reject(err) : resolve(true)));
}
exports.default = connectToDatabase;
;
