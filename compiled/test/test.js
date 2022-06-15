"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbManager_test_1 = require("./dbManager.test");
const home_test_1 = require("./home.test");
/*describe("Describe something",()=>{
    it("Do something",()=>{

    });
});*/
describe("HOME TEST", () => {
    (0, home_test_1.homeTest)();
});
describe.only("DB MANAGER TEST", () => {
    (0, dbManager_test_1.dbManagerTest)();
});
