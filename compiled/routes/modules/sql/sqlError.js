"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlError = void 0;
const sqlError = (err, res) => {
    let message;
    switch (err.code) {
        case "ECONNREFUSED":
            message = "Connection refused please check if mariaDb is enabled.";
            break;
        case "ER_ACCESS_DENIED_NO_PASSWORD_ERROR":
            message = "The provided user doesn't exist.";
            break;
        case "ER_ACCESS_DENIED_ERROR":
            message = "Wrong password";
            break;
        default:
            message = "Something wrong happened please retry.";
    }
    ;
    return res.status(400).json({ message: message });
};
exports.sqlError = sqlError;
