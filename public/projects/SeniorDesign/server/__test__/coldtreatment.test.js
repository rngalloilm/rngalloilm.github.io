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

describe("tests ColdTreatment API", () => {

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

    test("POST /coldtreatments", async () => {
        const newColdTreatment = {
            coldTreatmentId: "1",
            numberEmbryos: 3,
            dateCold: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            locationId: "Mountain Research Station",
            coldTreatmentGeneticId: geneticIdId,
        };
        const response = await request(app).post("/coldtreatments").send(newColdTreatment);
        expect(response.statusCode).toBe(200);
    });

    test("POST /coldtreatments failure", async () => {
        const newColdTreatment = {
            coldTreatmentId: null,
            dateCold: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            active: true,
            locationId: null,
            coldTreatmentGeneticId: 0,
        };
        const response = await request(app).post("/coldtreatments").send(newColdTreatment);
        expect(response.statusCode).toBe(400);
    });

    test("GET /coldtreatments", async () => {
        const response = await request(app).get("/coldtreatments");
        expect(response.statusCode).toBe(200);
    });

    test("GET /coldtreatments/:id", async () => {
        const response = await request(app).get("/coldtreatments/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /coldtreatments/:id failure", async () => {
        const response = await request(app).get("/coldtreatments/0");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /coldtreatments/:id", async () => {
        const newColdTreatment = {
            coldTreatmentId: "1",
            dateCold: new Date("2020-01-01"),
            transferDate: new Date("2020-14-01"),
            active: false,
            locationId: "Mountain Research Station",
            coldTreatmentGeneticId: geneticIdId,
        };
        const response = await request(app).put("/coldtreatments/1").send(newColdTreatment);
        expect(response.statusCode).toBe(200);
    });
    
    test("PUT /coldtreatments/:id body failure", async () => {
        const newColdTreatment = {
            coldTreatmentId: null,
            dateCold: new Date("2020-01-01"),
            transferDate: "2020-14-01",
            active: true,
            locationId: null,
            coldTreatmentGeneticId: 0,
        };
        const response = await request(app).put("/coldtreatments/update/1").send(newColdTreatment);
        expect(response.statusCode).toBe(400);
    });

    test("PUT /coldtreatments/:id path failure", async () => {
        const newColdTreatment = {
            coldTreatmentId: "1",
            dateCold: new Date("2020-01-01"),
            active: false,
            locationId: "Mountain Research Station",
            coldTreatmentGeneticId: geneticIdId,
        };

        const response = await request(app).put("/coldtreatments/0").send(newColdTreatment);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE /coldtreatments/:id", async () => {
        const response = await request(app).delete("/coldtreatments/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /coldtreatments/:id failure", async () => {
        const response = await request(app).delete("/coldtreatments/0");
        expect(response.statusCode).toBe(404);
    });

});