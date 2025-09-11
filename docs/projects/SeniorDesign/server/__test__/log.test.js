const request = require("supertest");
require("dotenv");
const createServer = require("../server");

async function setUp() {
    const app = await createServer();
    return app;
}

let app;
jest.setTimeout(15000);

describe("tests Logs API", () => {
  
      beforeAll(async () => {
          app = await setUp();
      });
  
      afterAll(async () => {
          await request(app).delete("/logs").send({ id: 1 });
      });
  
      test("GET /api/logs", async () => {
          const response = await request(app).get("/logs");
          expect(response.statusCode).toBe(200);
      });

      test("POST /api/logs", async () => {
        const newLog = {
            id: 1,
            action: "Test",
            userId: "Test"
        };
        const response = await request(app).post("/logs").send(newLog);
        expect(response.statusCode).toBe(200);
    });
  
      test("GET /api/logs/:id", async () => {
          const response = await request(app).get("/logs/1");
          expect(response.statusCode).toBe(200);
      });
  });