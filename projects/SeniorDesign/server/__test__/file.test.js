const request = require('supertest');
require('dotenv');

const createServer = require('../server');

async function setUp() {
  const app = await createServer({force: true});
  return app;
}
let app;
jest.setTimeout(30000);

const ensurePopExists = async () => {
    const response = await request(app).get("/populations");
    
    let exists = false;
    if(!!response.body) {
        let i = 0;
        while(i < response.body.length) {
            if(response.body[i].id == 100) {
                exists = true;
            }
            i++;
        }
    }

    if(!exists) {
        const popRes = await request(app).post("/populations").send({id: "100"});
        expect(popRes.statusCode).toBe(200);
    }
}

const ensureTestingGenIdExists = async () => {
    const response = await request(app).get("/genetic-id/1");

    if(!response || response.statusCode !== 200) {
        //Creating geneticId to use with files
        const newGeneticId = {
            geneticId: "1",
            progenyId: "A3",
            familyId: "51",
            rametId: null,
            species: "Test Species",
            yearPlanted: "1989",
            populationId: "100"
        };
        
        const createResponse = await request(app).post("/genetic-id").send(newGeneticId);
        expect(createResponse.statusCode).toBe(200);
    }
}

const ensureLocationExists = async () => {
    const response = await request(app).get("/locations/t3st");

    if(!response || response.statusCode !== 200) {
        const newLocation = {
            location: 't3st',
            shorthand: 't3st'
        };

        const createResponse = await request(app).post('/locations').send(newLocation);
        expect(createResponse.statusCode).toBe(200);
    }
}

const ensureTreeExists = async () => {
    const response = await request(app).get("/trees/1");

    if(!response || response.statusCode !== 200) {
        const newTree = {
            treeId: '1',
            gps: 'testGPS123',
            locationId: 't3st',
            treeGeneticId: '1'
        }

        const createResponse = await request(app).post('/trees').send(newTree);
        expect(createResponse.statusCode).toBe(200);
    }
}

describe('files API', () => {
    beforeAll(async () => {
        app = await setUp();
        
        //Creating tree requires location
        await ensureLocationExists();

        //Creating Population to use with Genetic Ids
        await ensurePopExists();

        //Creating GeneticId to use with files
        await ensureTestingGenIdExists();

        //Creating tree
        await ensureTreeExists();
    });

    afterAll(async() => {
        await request(app).delete('/populations').send({id: '100'});
        await request(app).delete('/genetic-id').send({id: 1});
        await request(app).delete('/locations').send({location: 't3st'});
        await request(app).delete('/trees').send({id: 1});
    });

    test('GET should return 404, geneticId not found', async () => {
        const response = await request(app).get('/files/101');
        expect(response.statusCode).toBe(404);
    });

    test('GET should return 200, no files created yet', async () => {
        const response = await request(app).get('/files/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test('POST should return 400, bad request -- no file data', async () => {
        const newfile = {
            materialId: 100,
            fileName: 'filename.png'
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 400, bad request -- not file data/name', async () => {
        const newfile = {
            materialId: 100
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 400, bad request -- no geneticId specified or fileName', async () => {
        const newfile = {
            fileData: 'xyzbytesandmorebytesdotfile'
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 400, no fileName', async () => {
        const newfile = {
            materialId: 1,
            fileData: 'xyzbytesandmorebytesdotfile', 
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(400);
    });

    test('POST should return 200, success response', async () => {
        const newfile = {
            materialId: 1,
            fileData: 'xyzbytesandmorebytesdotfile', 
            fileName: 'testfile.png',
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should reflect newly added file', async () => {
        const response = await request(app).get('/files/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].fileId).toBe(1);
    });

    test('POST should return 200, succesful addition of extra file', async () => {
        const newfile = {
            materialId: 1,
            fileData: 'xyzbytesandmorebytesnumerodosdotfile',
            fileName: 'testfile2.png'
        };

        const response = await request(app).post('/files').send(newfile);
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should reflect both files', async () => {
        const response = await request(app).get('/files/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].fileId).toBe(1);
        expect(response.body[1].associatedMaterial).toBe(1);
        expect(response.body[1].fileId).toBe(2);
    });

    test('DELETE should return 404, Id not found', async () => {
        const response = await request(app).delete('/files/100');
        expect(response.statusCode).toBe(404);
    });

    test('DELETE should return 200, deleting file success', async () => {
        const response = await request(app).delete('/files/2');
        expect(response.statusCode).toBe(200);
    });

    test('GET should return 200, should show one file', async () => {
        const response = await request(app).get('/files/1');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].associatedMaterial).toBe(1);
        expect(response.body[0].fileId).toBe(1);
    });

    test('DELETE should return 200, deleting file success', async () => {
        const response = await request(app).delete('/files/1');
        expect(response.statusCode).toBe(200);
    });

    test('DELETE should return 404, Id doesn\'t exist in database', async () => {
        const response = await request(app).delete('/files/1');
        expect(response.statusCode).toBe(404);
    });

    test('GET should return 200, empty files response -- none left', async () => {
        const response = await request(app).get('/files/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});