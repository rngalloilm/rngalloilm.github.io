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

describe("tests Greenhouse API", () => {

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

    test("POST /greenhouses", async () => {
                
            const newGreenhouse = {
                greenhouseId: "1",
                dateGreenhouse: new Date("2020-01-01"),
                active: true,
                locationId: "Mountain Research Station",
                greenhouseGeneticId: geneticIdId,
                transferDate: new Date("2020-01-14"),
            };
        
            const response = await request(app).post("/greenhouses").send(newGreenhouse);
            expect(response.statusCode).toBe(200);
    });

    test("GET /greenhouses", async () => {
        const response = await request(app).get("/greenhouses");
        expect(response.statusCode).toBe(200);
    });

    test("GET /greenhouses/:id", async () => {
        const response = await request(app).get("/greenhouses/1");
        expect(response.statusCode).toBe(200);
    });

    test("PUT /greenhouses/:id", async () => {
        const updateGreenhouse = {
            greenhouseId: "1",
            dateGreenhouse: new Date("2020-01-01"),
            active: true,
            locationId: "Mountain Research Station",
            greenhouseGeneticId: geneticIdId,
            transferDate: new Date("2020-12-12"),

        };
        const response = await request(app).put("/greenhouses/1").send(updateGreenhouse);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /greenhouses/:id invalid path", async () => {
        const updateGreenhouse = {
            greenhouseId: "1",
            dateGreenhouse: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            locationId: "Mountain Research Station",
            greenhouseGeneticId: geneticIdId,
        };
        const response = await request(app).put("/greenhouses/2").send(updateGreenhouse);
        expect(response.statusCode).toBe(404);
    });

    test("PUT /greenhouses/:id invalid body", async () => {
        const updateGreenhouse = {
            greenhouseId: null,
            dateGreenhouse: new Date("2020-01-01"),
            transferDate: null,
            active: true,
            locationId: null,
            greenhouseGeneticId: geneticIdId,
        };
        const response = await request(app).put("/greenhouses/update/1").send(updateGreenhouse);
        expect(response.statusCode).toBe(400);
    });

    test("DELETE /greenhouses/:id", async () => {
        const response = await request(app).delete("/greenhouses/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /greenhouses/:id invalid path", async () => {
        const response = await request(app).delete("/greenhouses/1");
        expect(response.statusCode).toBe(404);
    });
});