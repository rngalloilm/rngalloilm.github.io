const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(15000);

describe("tests species API", () => {
  
    beforeAll(async () => {
      
      app = await setUp();
    });
  
    test("POST /species success", async()=>{
      const newSpecies = {
        species: "Fraser Fir",
        shorthand: "FR",
        active: true
      };
      const response = await request(app).post("/species").send(newSpecies);
      expect(response.statusCode).toBe(200);
    });

    test("POST /species failure", async()=>{
      const newSpecies = {
        species: "Fraser Fir",
        shorthand: "FR",
        active: true
      };
      const response = await request(app).post("/species").send(newSpecies);
      expect(response.statusCode).toBe(400);
    });

    test("GET /species", async()=>{
      const response = await request(app).get("/species");
      expect(response.statusCode).toBe(200);
    });

    test("DELETE /species success", async()=>{
      const response = await request(app).delete("/species").send({species: "Fraser Fir"});
      expect(response.statusCode).toBe(200);
    });

    test("DELETE /species failure", async()=>{
      const response = await request(app).delete("/species").send({species: "Momi Fir"});
      expect(response.statusCode).toBe(404);
    });
  }
);
