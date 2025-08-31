const { describe } = require("node:test");
const request = require("supertest");
require("dotenv");
const createServer = require("../server");

async function setUp() {
    const app = await createServer();
    return app;
}

let app;
jest.setTimeout(15000);
let geneticIdId;

describe("test FieldStation API", () => {

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

    test("POST /fieldstation", async () => {
        const newFieldStation = {
            fieldStationId: "1",
            datePlanted: "2020-01-01",
            active: true,
            locationId: "Mountain Research Station",
            fieldStationGeneticId: geneticIdId,
        };
        const response = await request(app).post("/fieldstations").send(newFieldStation);
        expect(response.statusCode).toBe(200);
    });

    test("POST /fieldstation failure", async () => {
        const newFieldStation = {
            fieldStationId: "1",
            datePlanted: "2020-01-01",
            active: true,
            locationId: "Mountain Research Station",
            fieldStationGeneticId: geneticIdId,
        };
        const response = await request(app).post("/fieldstations").send(newFieldStation);
        expect(response.statusCode).toBe(400);
    });

    test("GET /fieldstation", async () => {
        const response = await request(app).get("/fieldstations");
        expect(response.statusCode).toBe(200);
    });

    test("GET /fieldstation/:id", async () => {
        const response = await request(app).get("/fieldstations/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /fieldstation/:id failure", async () => {
        const response = await request(app).get("/fieldstations/2");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /fieldstation/:id", async () => {
        const newFieldStation = {
            fieldStationId: "1",
            datePlanted: "2020-01-01",
            active: true,
            locationId: "Mountain Research Station",
            fieldStationGeneticId: geneticIdId,
        };
        const response = await request(app).put("/fieldstations/1").send(newFieldStation);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /fieldstation/:id path failure", async () => {
        const newFieldStation = {
            fieldStationId: null,
            datePlanted: null,
            active: false,
            locationId: "Mountain Research Station",
            fieldStationGeneticId: geneticIdId,
        };
        const response = await request(app).put("/fieldstations/2").send(newFieldStation);
        expect(response.statusCode).toBe(404);
    });

    test("PUT /fieldstation/:id body failure", async () => {
        const newFieldStation = {
            fieldStationId: null,
            datePlanted: null,
            active: false,
            locationId: "Mountain Research Station",
            fieldStationGeneticId: geneticIdId,
        };

        const response = await request(app).put("/fieldstations/update/1").send(newFieldStation);
        expect(response.statusCode).toBe(400);
    });
    test("DELETE /fieldstation/:id", async () => {
        const response = await request(app).delete("/fieldstations/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /fieldstation/:id failure", async () => {
        const response = await request(app).delete("/fieldstations/2");
        expect(response.statusCode).toBe(404);
    });
});