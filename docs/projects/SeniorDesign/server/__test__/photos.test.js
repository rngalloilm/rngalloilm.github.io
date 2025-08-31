const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(30000);



describe('Photos API', () => {
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
        const newTree = {
            treeId: "1",
            gps: "23.231334 24.13241",
            locationId: "Mountain Research Station",
            treeGeneticId: "1",
        }
          await request(app).post("/trees").send(newTree);
        
    });

    afterAll(async() => {
        
        await request(app).delete("/populations").send({id: "1"});
        await request(app).delete("/genetic-id").send({id: 1});
        await request(app).delete("/locations").send({location: "Mountain Research Station"});
        await request(app).delete('/trees').send({id: 1});
    });

    test('GET should return 404, geneticId not found', async () => {
        const response = await request(app).get('/photos/101');
        expect(response.statusCode).toBe(404);
    });
    test('GET should return 200, empty photos response -- no photos created', async () => {
        const response = await request(app).get('/photos/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });


    test('POST should return 400, bad request -- not photo data', async () => {
        const newPhoto = {
            materialId: 100, 
        };

        const response = await request(app).post('/photos').send(newPhoto);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 400, bad request -- not photo/type data', async () => {
        const newPhoto = {
            materialId: 100
        };

        const response = await request(app).post('/photos').send(newPhoto);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 400, bad request -- no geneticId specified', async () => {
        const newPhoto = {
            photoData: 'xyzbytesandmorebytesdotphoto'
        };

        const response = await request(app).post('/photos').send(newPhoto);
        expect(response.statusCode).toBe(400);
    });


    test('POST should return 200, succesful creation response', async () => {
        const newPhoto = {
            materialId: 1,
            photoData: 'xyzbytesandmorebytesdotphoto', 
        };

        const response = await request(app).post('/photos').send(newPhoto);
        console.log(response);
        console.log(response.error);
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should reflect newly added photo', async () => {
        const response = await request(app).get('/photos/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].photoId).toBe(1);
    });

    test('POST should return 200, succesful addition of extra photo', async () => {
        const newPhoto = {
            materialId: 1,
            photoData: 'xyzbytesandmorebytesnumerodosdotphoto', 
        };

        const response = await request(app).post('/photos').send(newPhoto);
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should reflect both photos', async () => {
        const response = await request(app).get('/photos/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].photoId).toBe(1);
        expect(response.body[1].associatedMaterial).toBe(1);
        expect(response.body[1].photoId).toBe(2);
    });

    test('DELETE should return 404, Id not found', async () => {
        const response = await request(app).delete('/photos/100');
        expect(response.statusCode).toBe(404);
    });

    test('DELETE should return 200, deleting photo success', async () => {
        const response = await request(app).delete('/photos/2');
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should show one photo', async () => {
        const response = await request(app).get('/photos/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].photoId).toBe(1);
    });

    test('DELETE should return 200, deleting photo success', async () => {
        const response = await request(app).delete('/photos/1');
        expect(response.statusCode).toBe(200);
    });

    test('DELETE should return 404, Id doesn\'t exist in database', async () => {
        const response = await request(app).delete('/photos/1');
        expect(response.statusCode).toBe(404);
    });

    test('GET should return 200, empty photos response -- none left', async () => {
        const response = await request(app).get('/photos/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});
