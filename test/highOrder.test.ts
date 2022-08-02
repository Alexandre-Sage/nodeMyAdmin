describe("ALL", async function () {
    await require("./loginTest/login.test");
    await require("./dbManagerAllDb/highOrder.test");
    await require("./dbManagerOneDb/highOrder.test");
});
