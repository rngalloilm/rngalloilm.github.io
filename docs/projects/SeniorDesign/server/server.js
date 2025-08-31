const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// const origin = "http://localhost:3000";
const origin = "http://localhost/";

app.use(express.json({ limit: '10mb'}));
const corsOrigin ={
  origin: origin, //or whatever port your frontend is using
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));
app.use(express.urlencoded({ extended: true }));


const db = require('./database/database');
const locationModel = require('./models/locations.model');
const populationModel = require("./models/population.model");
const geneticIdModel = require("./models/genetic-id.model");
const treeModel = require("./models/tree.model");
const speciesModel = require("./models/species.model");
const rametModel = require("./models/ramet.model");
const coneModel = require("./models/cone.model");
const seedModel = require("./models/seed.model");
const initiationModel = require("./models/initiation.model");
const maintenanceModel = require("./models/maintenance.model");
const acclimationModel = require("./models/acclimation.model");
const coldTreatmentModel = require("./models/coldtreatment.model");
const germinationModel = require("./models/germination.model");
const fieldStationModel = require("./models/fieldstation.model");
const maturationModel = require("./models/maturation.model");
const greenhouseModel = require("./models/greenhouse.model");
const userModel = require("./models/user.model");
const logModel = require("./models/log.model");
const photoModel = require('./models/photo.model');
const fileModel = require('./models/file.model');

require('./routes/routes')(app);

async function trySync(models, attempts, options) {
  if (Array.isArray(models)) {
    for (let model of models) {
      try {
        await model.sync(options);
      } catch (e) {
        if (attempts > 0) {
          await trySync(model, attempts - 1);
        } else {
          console.log("Could not sync model", model);
        }
      }
    }
  } else {
    try {
      await models.sync(options);
    } catch (e) {
      if (attempts > 0) {
        await trySync(models, attempts - 1);
      } else {
        console.log("Could not sync model", models);
      }
    }
  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

module.exports = async function createServer(options) {
  try {
    for(let x = 3; x > 0; x--) {
      try {
        await db.authenticate();
        console.log("Connected!");
        break;
      } catch(error) {
        console.log('Failed to connect, trying again...');
        console.log(error);
        await delay(10000);
      }
    }
    
    // Sync Models
    const models = [locationModel, populationModel, speciesModel, geneticIdModel, treeModel,
      rametModel, coneModel, seedModel, initiationModel, maintenanceModel, acclimationModel, 
      coldTreatmentModel, germinationModel, fieldStationModel, maturationModel, greenhouseModel, userModel, logModel, photoModel, fileModel];
    await trySync(models, 3, options);
  }
  catch (error) {
    console.log("Could not connect to the database, ", error.original);
  }
  return app;
}