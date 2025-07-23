const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(15000);


let geneticIdId;

describe("tests tree API", () => {
    
      beforeAll(async () => {
        app = await setUp();
  
        await request(app).post("/populations").send({id: "1"});
        const newGeneticId = {
          id: 0,
          geneticId: "003",
          progenyId: "A3",
          familyId: "51",
          species: "Fraser Fir",
          yearPlanted: "1989",
          populationId: "1"
        };
    
        await request(app).post("/genetic-id").send(newGeneticId);
        await request(app).post("/locations").send({location: "Mountain Research Station", shorthand: "MRS"});
      });
  
      afterAll(async () => {
        await request(app).delete("/populations").send({id: "1"});
        const response = await request(app).get("/genetic-id");
        geneticIdId = response.body[0].id;
        await request(app).delete("/genetic-id").send({id: geneticIdId});
        await request(app).delete("/locations").send({location: "Mountain Research Station", shorthand: "MRS"});
      });
    
      test("POST /trees", async()=>{
  
        const newTree = {
          treeId: "1",
          gps: "23.231334 24.13241",
          locationId: "Mountain Research Station",
          treeGeneticId: geneticIdId,
        };
  
        const response = await request(app).post("/trees").send(newTree);
        expect(response.statusCode).toBe(200);
      });
  
      test("POST /trees failure", async()=>{
        const newTree = {
          treeId: "1",
          gps: "23.231334 24.13241",
          locationId: "Mountain Research Station",
          treeGeneticId: geneticIdId,
        };
  
        const response = await request(app).post("/trees").send(newTree);
        expect(response.statusCode).toBe(400);
      });
    
      test("GET /trees", async()=>{
        const response = await request(app).get("/trees");
        expect(response.statusCode).toBe(200);
        expect(response.body[0].treeId).toBe("1");
      });

      test("GET a single /trees", async()=>{
        const response = await request(app).get("/trees/1");
        expect(response.statusCode).toBe(200);
        expect(response.body.treeId).toBe("1");
      });

      test("GET a single /trees failure", async()=>{
        const response = await request(app).get("/trees/0");
        expect(response.statusCode).toBe(404);
      });
  
      test("UPDATE /trees as inactive", async()=>{
        const response = await request(app).put("/trees/1");
        expect(response.statusCode).toBe(200);
      });

      test("UPDATE /trees as inactive failure", async()=>{
        const response = await request(app).put("/trees/0");
        expect(response.statusCode).toBe(404);
      });

      test("DELETE /trees", async()=>{
        const response = await request(app).delete("/trees/1");
        expect(response.statusCode).toBe(200);
      });

      test("DELETE /trees failure", async()=>{
        const response = await request(app).delete("/trees/0");
        expect(response.statusCode).toBe(404);
      }
    );
  });