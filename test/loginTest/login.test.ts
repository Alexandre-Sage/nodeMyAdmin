//import mocha from "mocha";
//import chai from "chai";
//import {testGetRoute, testPostRoute} from "../testModules/httpModule.test";
//import {htmlHeader200ObjectNoCookie, htmlHeader200ObjCookie, assertBodyNoRedirectObj, assertBodyRedirectObj, noErrorObject,jsonSqlError400Object,clientErrorObject} from "../globalsTestVar";
//
//import chaiHttp,{} from "chai-http";
//import server from "../../server";
//chai.use(chaiHttp);
//const {log,table}=console;
//{password:process.env.DB_PASSWORD,userName:process.env.DB_USER}

export default describe("CONNEXION ROUTER", function () {
    require("./connexionPage/getPage.test");
    require("./sucessTest/sucess.test");
    require("./errorTest/errorHighOrder.test");
});
