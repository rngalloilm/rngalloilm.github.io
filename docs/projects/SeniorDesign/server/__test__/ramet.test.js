const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
  const app = await createServer({ force: true });
  return app;
}
let app;
jest.setTimeout(16000);


let geneticIdId;

describe("tests ramet API", () => {

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

  test("POST /ramets", async () => {

    const newRamet = {
      id: 1,
      motherTreeId: "1",
      gps: "23.231334 24.13241",
      transferDate: new Date("2020-01-14"),
      locationId: "Mountain Research Station",
      rametGeneticId: geneticIdId
    };

    const response = await request(app).post("/ramets").send(newRamet);
    expect(response.statusCode).toBe(200);
  });

  test("POST /ramets failure", async () => {
    const newRamet = {
      id: 1,
      motherTreeId: "1",
      transferDate: new Date("2020-01-14"),
      gps: "23.231334 24.13241",
      locationId: "Mountain Research Station",
      rametGeneticId: geneticIdId
    };

    const response = await request(app).post("/ramets").send(newRamet);
    expect(response.statusCode).toBe(400);
  });

  test("GET /ramets", async () => {
    const response = await request(app).get("/ramets");
    expect(response.statusCode).toBe(200);
  });

  test("GET /ramets/:id", async () => {
    const response = await request(app).get("/ramets/1");
    expect(response.statusCode).toBe(200);
  });

  test("GET /ramets/:id failure", async () => {
    const response = await request(app).get("/ramets/2");
    expect(response.statusCode).toBe(404);
  });

  test("PUT /ramets/:id", async () => {
    let response = await request(app).put("/ramets/1");
    expect(response.statusCode).toBe(200);

    response = await request(app).get("/ramets/1");
    expect(response.body.active).toBe(false);
  });

  test("PUT /ramets/:id failure", async () => {
    const response = await request(app).put("/ramets/2");
    expect(response.statusCode).toBe(404);
  });

  test("DELETE /ramets/:id", async () => {
    const response = await request(app).delete("/ramets/1");
    expect(response.statusCode).toBe(200);
  });

  test("DELETE /ramets/:id failure", async () => {
    const response = await request(app).delete("/ramets/2");
    expect(response.statusCode).toBe(404);
  });

});
