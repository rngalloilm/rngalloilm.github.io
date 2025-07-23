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

describe("test Initiation API", () => {

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

    test("POST /initiation", async () => {
        const newInitiation = {
            initiationId: "1",
            seedsAndEmbryos: 2,
            mediaBatch: "1",
            dateMade: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            initiationGeneticId: geneticIdId,
            locationId: "Mountain Research Station",
            numberOfPlates: 1
        };
        const response = await request(app).post("/initiations").send(newInitiation);
        expect(response.statusCode).toBe(200);
    });

    test("POST /initiation failure", async () => {
        const newInitiation = {
            initiationId: null,
            seedsAndEmbryos: 2,
            mediaBatch: "1",
            dateMade: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            initiationGeneticId: geneticIdId,
            locationId: "Mountain Research Station",
            numberOfPlates: null
        };
        const response = await request(app).post("/initiations").send(newInitiation);
        expect(response.statusCode).toBe(400);
    });

    test("GET /initiation", async () => {
        const response = await request(app).get("/initiations");
        expect(response.statusCode).toBe(200);
    });

    test("GET /initiation/:id", async () => {
        const response = await request(app).get("/initiations/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /initiation/:id failure", async () => {
        const response = await request(app).get("/initiations/2");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /initiation/:id", async () => {
        const newInitiation = {
            initiationId: "1",
            seedsAndEmbryos: 2,
            mediaBatch: "1",
            dateMade: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            active: false,
            initiationGeneticId: geneticIdId,
            locationId: "Mountain Research Station",
            numberOfPlates: 2
        };
        const response = await request(app).put("/initiations/1").send(newInitiation);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /initiation/:id path failure", async () => {
        const newInitiation = {
            initiationId: "1",
            seedsAndEmbryos: 2,
            mediaBatch: "1",
            dateMade: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            active: false,
            initiationGeneticId: geneticIdId,
            locationId: "Mountain Research Station",
            numberOfPlates: 2
        };
        const response = await request(app).put("/initiations/2").send(newInitiation);
        expect(response.statusCode).toBe(404);
    });

    test("PUT /initiation/:id body failure", async () => {
        const newInitiation = {
            initiationId: null,
            seedsAndEmbryos: null,
            mediaBatch: null,
            dateMade: null,
            transferDate: null,
            active: false,
            initiationGeneticId: geneticIdId,
            locationId: "Mountain Research Station",
            numberOfPlates: null
        };

        const response = await request(app).put("/initiations/update/1").send(newInitiation);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE /initiation/:id", async () => {
        const response = await request(app).delete("/initiations/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /initiation/:id failure", async () => {
        const response = await request(app).delete("/initiations/1");
        expect(response.statusCode).toBe(404);
    });
});