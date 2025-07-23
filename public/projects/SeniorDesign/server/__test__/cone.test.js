const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(15000);


let geneticIdId;

// Tests the cone API
describe("tests cone API", () => {
  
  beforeAll(async () => {
    app = await setUp();

    await request(app).post("/populations").send({id: "1"});
    const newGeneticId = {
      id: 0,
        geneticId: "003",
        progenyId: "A3",
        familyId: "51",
        species: "Fraser Fir",
        yearPlanted: "1989",
        populationId: "1"
    };

    await request(app).post("/genetic-id").send(newGeneticId);
    await request(app).post("/locations").send({location: "Mountain Research Station", shorthand: "MRS"});
    const response = await request(app).get("/genetic-id");
    geneticIdId = response.body[0].id;

    const newTree = {
      treeId: "1",
      gps: "23.231334 24.13241",
      locationId: "Mountain Research Station",
      treeGeneticId: geneticIdId,
    }

    await request(app).post("/trees").send(newTree);
  });

  afterAll(async () => {
    const response = await request(app).get("/genetic-id");
    geneticIdId = response.body[0].id;
    await request(app).delete("/genetic-id").send({id: geneticIdId});
    await request(app).delete("/populations").send({id: "1"});
    await request(app).delete("/locations").send({location: "Mountain Research Station", shorthand: "MRS"});
    await request(app).delete("/trees/1");
  });

  test("POST /cones", async()=>{
    const newCone = {
      id: "1",
      motherTreeId: "1",
      fatherTreeId: null,
      dateHarvested: "2020-01-01",
      locationId: "Mountain Research Station",
      rametId: null,
      coneGeneticId: geneticIdId,
    }
    const response = await request(app).post("/cones").send(newCone);
    expect(response.status).toBe(200);
  });

  test("POST /cones failure", async()=>{
    const newCone = {
      id: "1",
      motherTreeId: "1",
      fatherTreeId: null,
      dateHarvested: "2020-01-01",
      locationId: "Mountain Research Station",
      rametId: null,
      coneGeneticId: geneticIdId,
    }
    const response = await request(app).post("/cones").send(newCone);
    expect(response.status).toBe(400);
  });

  test("GET /cones", async()=>{
    const response = await request(app).get("/cones");
    expect(response.status).toBe(200);
  });

  test("GET /cones/:id", async()=>{
    const response = await request(app).get("/cones/1");
    expect(response.status).toBe(200);
  });

  test("GET /cones/:id failure", async()=>{
    const response = await request(app).get("/cones/2");
    expect(response.status).toBe(404);
  });

  test("PUT /cones/:id", async()=>{
    const response = await request(app).put("/cones/1");
    expect(response.status).toBe(200);
  });

  test("PUT /cones/:id failure", async()=>{
    const response = await request(app).put("/cones/2");
    expect(response.status).toBe(404);
  });

  test("DELETE /cones/:id", async()=>{
    const response = await request(app).delete("/cones/1");
    expect(response.status).toBe(200);
  });
});