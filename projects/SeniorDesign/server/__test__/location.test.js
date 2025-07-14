const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
  const app = await createServer();
  return app;
}
let app;
jest.setTimeout(15000);

describe("tests location API", () => {

  beforeAll(async () => {
    
    app = await setUp();
  });

  test("POST /locations", async()=>{

    const newLocation = {
      location: "Laboratory",
      shorthand: "LAB"
    };

    const response = await request(app).post("/locations").send(newLocation);
    expect(response.statusCode).toBe(200);
  });

  test("GET /locations", async()=>{
    const response = await request(app).get("/locations");
    expect(response.statusCode).toBe(200);
  })

  test("GET /locations/:id", async()=>{
    const response = await request(app).get("/locations/Laboratory");
    expect(response.statusCode).toBe(200);
  })

  test("GET /locations/:id failure", async()=>{
    const response = await request(app).get("/locations/farm");
    expect(response.statusCode).toBe(404);
  }) 

  test("PUT /locations/edit/:location ", async()=>{
    const updatedLocation = {
      location: "Laboratory",
      shorthand: "LAB123"
    };
    const response = await request(app).put("/locations/edit/Laboratory").send(updatedLocation);
    expect(response.statusCode).toBe(200);
  }) 

  test("PUT /locations/edit/:location failure ", async()=>{
    const updatedLocation = {
      location: "farm",
      shorthand: "LAB123"
    };
    const response = await request(app).put("/locations/edit/farm").send(updatedLocation);
    expect(response.statusCode).toBe(404);
  }) 

  test("DELETE /locations failure", async()=>{
    const response = await request(app).delete("/locations").send(
      {
      location: "Charlotte",
    });
    expect(response.statusCode).toBe(404);
  })

  test("DELETE /locations", async()=>{
    const response = await request(app).delete("/locations").send(
      {
      location: "Laboratory",
    });
    expect(response.statusCode).toBe(200);
  });
})
