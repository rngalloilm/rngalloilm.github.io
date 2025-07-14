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

describe("test Maturation API", () => {

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

    test("POST /maturation", async () => {
        const newMaturation = {
            maturationId: "1",
            mediaBatch: "1",
            dateMatured: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            numberOfPlates: 1,
            active: true,
            maturationGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).post("/maturations").send(newMaturation);
        expect(response.statusCode).toBe(200);
    });

    test("POST /maturation failure", async () => {
        const newMaturation = {
            maturationId: null,
            mediaBatch: null,
            dateMatured: null,
            transferDate: null,
            numberOfPlates: null,
            active: null,
            maturationGeneticId: null,
            locationId: null
        };
        const response = await request(app).post("/maturations").send(newMaturation);
        expect(response.statusCode).toBe(400);
    });

    test("GET /maturation", async () => {
        const response = await request(app).get("/maturations");
        expect(response.statusCode).toBe(200);
    });

    test("GET /maturation/:id", async () => {
        const response = await request(app).get("/maturations/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /maturation/:id failure", async () => {
        const response = await request(app).get("/maturations/100");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /maturation/:id", async () => {
        const newMaturation = {
            maturationId: "1",
            mediaBatch: "1",
            dateMatured: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            numberOfPlates: 1,
            active: true,
            maturationGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).put("/maturations/1").send(newMaturation);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /maturation/:id failure", async () => {
        const newMaturation = {
            maturationId: null,
            mediaBatch: null,
            dateMatured: null,
            transferDate: null,
            numberOfPlates: null,
            active: false,
            maturationGeneticId: null,
            locationId: null
        };
        const response = await request(app).put("/maturations/update/1").send(newMaturation);
        expect(response.statusCode).toBe(400);
    });

    test("PUT /maturation/:id path failure", async () => {
        const newMaturation = {
            maturationId: "1",
            mediaBatch: "1",
            dateMatured: new Date("2020-01-01"),
            numberOfPlates: 1,
            active: true,
            maturationGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };

        const response = await request(app).put("/maturations/update/0").send(newMaturation);
        expect(response.statusCode).toBe(404);
    });


    test("DELETE /maturation/:id", async () => {
        const response = await request(app).delete("/maturations/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /maturation/:id failure", async () => {
        const response = await request(app).delete("/maturations/100");
        expect(response.statusCode).toBe(404);
    });

});