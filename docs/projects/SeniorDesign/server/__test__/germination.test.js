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

describe("tests Germination API", () => {
    
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

    test("POST /germination", async () => {
        const newGermination = {
            germinationId: "1",
            dateGermination: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            mediaBatch: "1",
            numberEmbryos: 1,
            active: true,
            locationId: "Mountain Research Station",
            germinationGeneticId: geneticIdId,
        };
        const response = await request(app).post("/germinations").send(newGermination);
        expect(response.statusCode).toBe(200);
    });

    test("POST /germination failure", async () => {
        const newGermination = {
            germinationId: null,
            dateGermination: new Date("2020-01-01"),
            transferDate: new Date("2020-01-14"),
            mediaBatch: null,
            numberEmbryos: null,
            active: true,
            locationId: null,
            germinationGeneticId: 0,
        };
        const response = await request(app).post("/germinations").send(newGermination);
        expect(response.statusCode).toBe(400);
    });

    test("GET /germination", async () => {
        const response = await request(app).get("/germinations");
        expect(response.statusCode).toBe(200);
    });

    test("GET /germination/:id", async () => {
        const response = await request(app).get("/germinations/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /germination/:id failure", async () => {
        const response = await request(app).get("/germinations/0");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /germination/:id", async () => {
        const newGermination = {
            germinationId: "1",
            dateGermination: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            mediaBatch: "1",
            numberEmbryos: 1,
            active: false,
            locationId: "Mountain Research Station",
            germinationGeneticId: geneticIdId,
        };
        const response = await request(app).put("/germinations/1").send(newGermination);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /germination/:id body failure", async () => {
        const newGermination = {
            germinationId: null,
            dateGermination: null,
            transferDate: null,
            mediaBatch: null,
            numberEmbryos: null,
            active: true,
            locationId: null,
            germinationGeneticId: 0,
        };
        const response = await request(app).put("/germinations/update/1").send(newGermination);
        expect(response.statusCode).toBe(400);
    });

    test("PUT /germination/:id failure", async () => {
        const newGermination = {
            germinationId: "1",
            dateGermination: new Date("2020-01-01"),
            transferDate: new Date("2020-10-14"),
            mediaBatch: "1",
            numberEmbryos: 1,
            active: false,
            locationId: "Mountain Research Station",
            germinationGeneticId: geneticIdId,
        };

        const response = await request(app).put("/germinations/0").send(newGermination);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE /germination/:id", async () => {
        const response = await request(app).delete("/germinations/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /germination/:id failure", async () => {
        const response = await request(app).delete("/germinations/0");
        expect(response.statusCode).toBe(404);
    });

});
       