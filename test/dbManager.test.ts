import mocha from "mocha";
import chai,{request,assert,should,expect} from "chai";
import chaiHttp from "chai-http";
import server from "../server";
chai.use(chaiHttp);
const {log,table}=console;

export const dbManagerTest=()=>describe("DB MANAGER ROUTER",()=>{
    describe("1) GET THE HOME PAGE AND DISPLAY ALL DATABASES",()=>{
        it("Should login and fetch all the availaible DB",(done)=>{
            const agent=chai.request.agent(server);
            agent.get("/")
            .end((err,res)=>{
                err?done(err):null
                expect(res).to.have.status(200);
                agent.post("/sign-in")
                .send({password:process.env.DB_PASSWORD,userName:process.env.DB_USER})
                .end((err,res)=>{
                    err?done(err):null
                    log(res)
                    expect(res).to.have.status(200);
                    log(res.body)
                    //expect(res.body).to.have.property("dataBases");
                    done()
                });
            });
            //done(
        });
    });
})
