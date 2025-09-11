const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
    const app = await createServer();
    return app;
}
let app;
jest.setTimeout(15000);

let geneticIdId;

describe("tests Acclimation API", () => {

    beforeAll(async () => {
      
      app = await setUp();

      await request(app).post("/populations").send({ id: "51" });
      
      const newGeneticId = {
        id: 0,
        geneticId: "003",
        progenyId: "A3",
        species: "Fraser Fir",
        yearPlanted: "1989",
        populationId: "51"
      };

      await request(app).post("/genetic-id").send(newGeneticId);
      await request(app).post("/locations").send({ location: "Mountain Research Station", shorthand: "MRS" });
      const response = await request(app).get("/genetic-id");
      geneticIdId = response.body[0].id;


    });

    afterAll(async () => {
        await request(app).delete("/populations").send({ id: "51" });
        const response = await request(app).get("/genetic-id");
        geneticIdId = response.body[0].id;
        await request(app).delete("/genetic-id").send({ id: geneticIdId });
        await request(app).delete("/locations").send({ location: "Mountain Research Station", shorthand: "MRS" });
    });

    test("POST /acclimations", async () => {
            
        const newAcclimation = {
            acclimationId: "1",
            dateAcclimation: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            locationId: "Mountain Research Station",
            acclimationGeneticId: geneticIdId,
        };
    
        const response = await request(app).post("/acclimations").send(newAcclimation);
        expect(response.statusCode).toBe(200);
    });

    test("POST /acclimations failure", async () => {
        const newAcclimation = {
            acclimationId: "1",
            dateAcclimation: null,
            transferDate: new Date("2020-01-14"),
            active: true,
            locationId: null,
            acclimationGeneticId: geneticIdId,
        };

        const response = await request(app).post("/acclimations").send(newAcclimation);
        expect(response.statusCode).toBe(400);
    });
    
    test("GET /acclimations", async () => {
        const response = await request(app).get("/acclimations");
        expect(response.statusCode).toBe(200);
    });

    test("GET /acclimations/:id", async () => {
        const response = await request(app).get("/acclimations/1");
        expect(response.statusCode).toBe(200);
        expect(response.body.acclimationId).toBe("1");
    });

    test("GET /acclimations/:id failure", async () => {
        const response = await request(app).get("/acclimations/2");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /acclimations/:id", async () => {
        const updateAcclimation = {
            acclimationId: "1",
            dateAcclimation: "2020-01-01",
            transferDate: new Date("2020-01-14"),
            active: false,
            locationId: "Mountain Research Station",
            acclimationGeneticId: geneticIdId,
        };
        const response = await request(app).put("/acclimations/1").send(updateAcclimation);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /acclimations/:id failure Invalid path", async () => {
        const updateAcclimation = {
            acclimationId: "1",
            dateAcclimation: "2020-01-01",
            transferDate: new Date("2020-01-14"),
            active: false,
            locationId: "Mountain Research Station",
            acclimationGeneticId: geneticIdId,
        };
        
        const response = await request(app).put("/acclimations/2").send(updateAcclimation);
        expect(response.statusCode).toBe(404);
    });

    test("PUT /acclimations/:id failure Invalid body", async () => {
        const updateAcclimation = {
            acclimationId: null,
            dateAcclimation: null,
            transferDate: null,
            active: false,
            locationId: null,
            acclimationGeneticId: geneticIdId,
        };
        const response = await request(app).put("/acclimations/update/1").send(updateAcclimation);
        expect(response.statusCode).toBe(400);
    });

    test("DELETE /acclimations/:id", async () => {
        const response = await request(app).delete("/acclimations/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /acclimations/:id failure", async () => {
        const response = await request(app).delete("/acclimations/2");
        expect(response.statusCode).toBe(404);
    });
});