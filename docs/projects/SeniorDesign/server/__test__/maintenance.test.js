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

describe("test Maintenance API", () => {

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

    test("POST /maintenance", async () => {
        const newMaintenance = {
            maintenanceId: "1",
            transferDate: new Date("2020-01-14"),
            dateCurr: new Date("2020-01-03"),
            mediaBatchCurr: "1",
            mediaBatchPrev: "1",
            datePrev: new Date("2020-01-01"),
            numberOfPlates: 1,
            active: true,
            maintenanceGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).post("/maintenances").send(newMaintenance);
        expect(response.statusCode).toBe(200);
    });

    test("POST /maintenance failure", async () => {
        const newMaintenance = {
            maintenanceId: null,
            transferDate: null,
            dateCurr: "2020-01-03",
            mediaBatchCurr: null,
            mediaBatchPrev: null,
            datePrev: "2020-01-01",
            numberOfPlates: null,
            active: true,
            maintenanceGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).post("/maintenances").send(newMaintenance);
        expect(response.statusCode).toBe(400);
    });

    test("GET /maintenance", async () => {
        const response = await request(app).get("/maintenances");
        expect(response.statusCode).toBe(200);
    });

    test("GET /maintenance/:id", async () => {
        const response = await request(app).get("/maintenances/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /maintenance/:id failure", async () => {
        const response = await request(app).get("/maintenances/2");
        expect(response.statusCode).toBe(404);
    });

    test("PUT /maintenance/:id", async () => {
        const updatedMaintenance = {
            maintenanceId: "1",
            dateCurr: new Date("2020-01-03"),
            mediaBatchCurr: "1",
            mediaBatchPrev: "1",
            datePrev: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            numberOfPlates: 1,
            active: true,
            maintenanceGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).put("/maintenances/1").send(updatedMaintenance);
        expect(response.statusCode).toBe(200);
    });

    test("PUT /maintenance/:id body failure", async () => {
        const updatedMaintenance = {
            maintenanceId: null,
            dateCurr: new Date("2020-01-03"),
            mediaBatchCurr: null,
            mediaBatchPrev: null,
            datePrev: null,
            transferDate: null,
            numberOfPlates: null,
            active: true,
            maintenanceGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).put("/maintenances/update/1").send(updatedMaintenance);
        expect(response.statusCode).toBe(400);
    });

    test("PUT /maintenance/:id path failure", async () => {
        const updatedMaintenance = {
            maintenanceId: "1",
            dateCurr: new Date("2020-01-03"),
            mediaBatchCurr: "1",
            mediaBatchPrev: "1",
            datePrev: new Date("2020-01-01"),
            transferDate: new Date("2020-02-14"),
            numberOfPlates: 1,
            active: true,
            maintenanceGeneticId: geneticIdId,
            locationId: "Mountain Research Station"
        };
        const response = await request(app).put("/maintenances/update/2").send(updatedMaintenance);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE /maintenance/:id", async () => {
        const response = await request(app).delete("/maintenances/1");
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /maintenance/:id failure", async () => {
        const response = await request(app).delete("/maintenances/1");
        expect(response.statusCode).toBe(404);
    });


});