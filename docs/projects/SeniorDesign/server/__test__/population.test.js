const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
    const app = await createServer({force: true});
    return app;
}
let app;
jest.setTimeout(15000);

describe("tests population API", () => {
        beforeAll(async () => {
            app = await setUp();
        });
    
        test("POST /populations success", async()=>{
    
            const newPopulation = {
                id: "1",
            };
    
            const response = await request(app).post("/populations").send(newPopulation);
            expect(response.statusCode).toBe(200);
            
        });

        test("POST /populations failure", async()=>{
            const newPopulation = {
                id: "1",
            };

            const response = await request(app).post("/populations").send(newPopulation);
            expect(response.statusCode).toBe(400);
        });
    
        test("GET /populations success", async()=>{
            const response = await request(app).get("/populations");
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual([{"id": "1"}]);
        });

        test("DELETE /populations success", async()=>{
            const response = await request(app).delete("/populations").send({id: "1"});
            expect(response.statusCode).toBe(200);
        });

        test("DELETE /populations failure", async()=>{
            const response = await request(app).delete("/populations").send({id: "2"});
            expect(response.statusCode).toBe(404);
        });
    }
);