//import mocha from "mocha";
import {dbManagerTest} from "./dbManager.test";
import {homeTest} from "./home.test";
/*describe("Describe something",()=>{
    it("Do something",()=>{

    });
});*/
describe("HOME TEST",()=>{
    homeTest();
});
describe("DB MANAGER TEST",()=>{
    dbManagerTest();
});
