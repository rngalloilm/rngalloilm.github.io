const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
  const app = await createServer({ force: true });
  return app;
}
let app;
jest.setTimeout(15000);


let geneticIdId;

// Tests the seed API
describe("tests seed API", () => {
  beforeAll(async () => {
    app = await setUp();

    await request(app).post("/populations").send({ id: "1" });
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
    await request(app).post("/locations").send({ location: "Mountain Research Station", shorthand: "MRS" });
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
    await request(app).delete("/genetic-id").send({ id: geneticIdId });
    await request(app).delete("/populations").send({ id: "1" });
    await request(app).delete("/locations").send({ location: "Mountain Research Station", shorthand: "MRS" });
    await request(app).delete("/trees/1");
  });

  test("POST /seeds", async () => {
    const newSeed = {
      id: "1",
      origin: "Mountains",
      transferDate: new Date("2020-01-14"),
      quantity: 100,
      dateMade: new Date("2020-01-01"),
      motherTreeId: "1",
      fatherTreeId: null,
      seedGeneticId: geneticIdId,
    }

    const response = await request(app).post("/seeds").send(newSeed);
    expect(response.statusCode).toBe(200);
  });

  test("POST /seeds failure", async () => {
    const newSeed = {
      id: "1",
      origin: "Mountains",
      quantity: 100,
      transferDate: null,
      dateMade: new Date("2020-01-01"),
      motherTreeId: "1",
      fatherTreeId: null,
      coneId: null,
      seedGeneticId: geneticIdId,
    }

    const response = await request(app).post("/seeds").send(newSeed);
    expect(response.statusCode).toBe(400);
  });

  test("GET /seeds", async () => {
    const response = await request(app).get("/seeds");
    expect(response.statusCode).toBe(200);
  });

  test("GET /seeds/:id", async () => {
    const response = await request(app).get("/seeds/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("1");
  });

  test("GET /seeds/:id failure", async () => {
    const response = await request(app).get("/seeds/2");
    expect(response.statusCode).toBe(404);
  });

  test("PUT /seeds/:id", async () => {
    const newSeed = {
      id: 1,
      origin: "Mountains",
      quantity: 80,
      dateMade: new Date("2020-01-01"),
      transferDate: new Date("2020-10-11"),
      motherTreeId: "1",
      fatherTreeId: null,
      coneId: null,
      seedGeneticId: geneticIdId,
    }
    const response = await request(app).put("/seeds/1");
    expect(response.statusCode).toBe(200);
  });

  test("PUT /seeds/:id failure", async () => {
    const response = await request(app).put("/seeds/2");
    expect(response.statusCode).toBe(404);
  });

  test("DELETE /seeds/:id", async () => {
    const response = await request(app).delete("/seeds/1");
    expect(response.statusCode).toBe(200);
  });

  test("DELETE /seeds/:id failure", async () => {
    const response = await request(app).delete("/seeds/2");
    expect(response.statusCode).toBe(404);
  });

});
