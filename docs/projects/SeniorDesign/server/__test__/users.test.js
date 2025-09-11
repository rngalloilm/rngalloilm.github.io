const request = require('supertest');
require('dotenv');
const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(15000);

describe("tests users API", () => {
  
  beforeAll(async () => {
    app = await setUp();
  }
  );

  //Post user
  test("POST /users", async()=>{
    const newUser = {
      unityId: "cjdennis",
      firstName: "Colby",
      lastName: "Dennis",
      email: "cjdennis@ncsu.edu",
      role: "admin",
    }
    const response = await request(app).post("/users").send(newUser);
    expect(response.statusCode).toBe(200);
  });

  //Post user failure
  test("POST /users failure", async()=>{
    const newUser = {
      unityId: "cjdennis",
      firstName: "Colby",
      lastName: "Dennis",
      email: "cjdennis@ncsu.edu",
      role: "admin",
    }
    const response = await request(app).post("/users").send(newUser);
    expect(response.statusCode).toBe(400);
  });

  //Get user
  test("GET /users", async()=>{
    const response = await request(app).get("/users/all");
    expect(response.statusCode).toBe(200);
  }
  );

  //Get current user
  test("GET /users/current", async()=>{
    const response = (await request(app).get("/users/current").set('x-shib_uid', 'cjdennis'));
    expect(response.statusCode).toBe(200);
  }
  );

  //Put user
  test("PUT /users", async()=>{
    const response = await request(app).put("/users/cjdennis").send({unityId: "cjdennis", firstName: "Colby", lastName: "Dennis", email: "cjdennis@ncsu.edu", role:"user"});
    expect(response.statusCode).toBe(200);
  });

  // Delete User
  test("DELETE /users", async()=>{
    const response = await request(app).delete("/users/cjdennis");
    expect(response.statusCode).toBe(200);
  }
  );

});