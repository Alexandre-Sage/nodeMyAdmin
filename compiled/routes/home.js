"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const server = (0, express_1.default)();
const router = express_1.default.Router();
/*router.get("/",function(req:Request,res:Response,next:NextFunction){
    console.log(req.session);
    res.status(200).json({message:"Hello World"})
});*/
router.get("/", (req, res, next) => {
    const csurfToken = crypto_1.default.randomBytes(50).toString('hex');
    const session = req.session;
    session.csurfToken = csurfToken;
    session.save();
    res.status(200).cookie("XSRF-TOKEN", csurfToken, {
        httpOnly: false,
        signed: true,
        sameSite: "strict",
    }).render("home");
});
router.post("/sign-in", (req, res, next) => {
    console.log(req.session);
    console.log(req.body);
    res.status(200);
});
exports.default = router;
