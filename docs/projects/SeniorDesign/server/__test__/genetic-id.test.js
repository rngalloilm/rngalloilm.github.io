const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(15000);

describe("tests genetic-id API", () => {
  
    beforeAll(async () => {
      app = await setUp();

      const res1 = await request(app).post("/populations").send({id: "1"});
      expect(res1.statusCode).toBe(200);
    });

    afterAll(async () => {
      const res1 = await request(app).delete("/populations").send({id: "1"});
      expect(res1.statusCode).toBe(200);
    });
  
    test("POST /genetic-id", async()=>{
  
      const newGeneticId = {
        id: 0,
        geneticId: "003",
        progenyId: "A3",
        familyId: "51",
        rametId: null,
        species: "Fraser Fir",
        yearPlanted: "1989",
        populationId: "1"
      };
  
      const response = await request(app).post("/genetic-id").send(newGeneticId);
      expect(response.statusCode).toBe(200);
    });

    test("POST /genetic-id failure", async()=>{
      const newGeneticId = {
        id: 0,
        geneticId: "003",
        progenyId: "A3",
        familyId: "51",
        rametId: null,
        species: "Fraser Fir",
        yearPlanted: "1989",
        populationId: "5"
      };

      const response = await request(app).post("/genetic-id").send(newGeneticId);
      expect(response.statusCode).toBe(400);
    });
  
    test("GET /genetic-id", async()=>{
      const response = await request(app).get("/genetic-id");
      expect(response.statusCode).toBe(200);
      expect(response.body[0].geneticId).toBe("003");
    })

    test("GET /genetic-id/:id", async()=>{
      const geneticId = await (await request(app).get("/genetic-id")).body[0].id;
      const response = await request(app).get("/genetic-id/" + geneticId);
      expect(response.statusCode).toBe(200);
      expect(response.body.geneticId).toBe("003");
    });

    test("GET /genetic-id/find/:populationId&:familyId&:rametId&:geneticId", async()=>{
      const response = await request(app).get("/genetic-id/find/1" + "&51" + "&null" + "&003");
      //console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body[0].progenyId).toBe("A3");
    });

    test("GET /genetic-id/find/:populationId&:familyId&:geneticId", async()=>{
      const response = await request(app).get("/genetic-id/find/" + "1" + "&51" + "&003");
      expect(response.statusCode).toBe(200);
    });

    test("GET /genetic-id/find/:populationId&:familyId", async()=>{
      const response = await request(app).get("/genetic-id/find/" + "1" + "&51");
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body[0].rametId).toBe(null);
    });

    test("GET /genetic-id/find/:populationId", async()=>{
      const response = await request(app).get("/genetic-id/find/" + "1");
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body[0].familyId).toBe("51");
    });
  
    test("DELETE /genetic-id", async()=>{
      const geneticId = await (await request(app).get("/genetic-id")).body[0].id;
      const response = await request(app).delete("/genetic-id").send(
        {
        id: geneticId,
      });
      expect(response.statusCode).toBe(200);
    });

    test("DELETE /genetic-id failure", async()=>{
      const response = await request(app).delete("/genetic-id").send(
        {
        id: 0,
      });
      expect(response.statusCode).toBe(404);
    });

  }
);