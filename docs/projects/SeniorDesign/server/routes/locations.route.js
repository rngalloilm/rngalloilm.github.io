module.exports = (app) => {
  const Location = require("../models/locations.model");
  let router = require("express").Router();
  const db = require("../database/database");

  //Gets all Locations
  router.get("/", async (req, res) => {
    await Location.findAll()
      .then((innerRes) => {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.send(innerRes);
      })
      .catch((error) => {
        console.log("Error in fetching locations: ", error);
      });
  });

  //Gets a location by name
  router.get("/:location", async (req, res) => {
    const reqLocation = req.params.location;
    const location = await Location.findOne({ where: { location: reqLocation } });
     if(location) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.send(location);
      } else{
        res.sendStatus(404);
      }
  });

  // Posts a location to the database
  router.post("/", async (req, res) => {
    const reqLocation = req.body.location;
    const reqShorthand = req.body.shorthand;

    await db.sync().then(async () => {
      await Location.create({
        location: reqLocation,
        shorthand: reqShorthand,
        active: true,
        isCheckedOut: false,
        checkedOutBy: null
      })
        .then((innerRes) => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.log("Error Inserting Record: ", error);
          res.sendStatus(400);
        });
    });
  });

  //delete a location by name
  router.delete("/:location", async (req, res) => { // Added :location to URL
    const deleted = req.params.location;
    try {
      const loc = await Location.findOne({ where: { location: deleted } });
      if (loc) {
        await loc.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting location: ", error);
      res.sendStatus(500);
    }
  });

  //edit a location
  router.put("/edit/:location", async (req, res) => {
    console.log("loc: " + req.params.location);
    const originalLocationName = req.params.location; // Name used to find the record
    const reqLocation = req.body.location;
    const reqShorthand = req.body.shorthand;
 
    try {
      const location = await Location.findOne({ where: { location: originalLocationName }});
      if(location) {
        await location.update({location: reqLocation, shorthand: reqShorthand});
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      // Handle potential unique constraint violation if new name already exists
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: `Location name "${newLocationName}" already exists.` });
      }
      res.status(500).json({ message: "Failed to update location." });
    }
  });

  // updates a location as inactive/active
  router.put('/:location', async (req, res) => {
    
      const reqLocation = req.params.location;
      const location = await Location.findOne({ where: { location: reqLocation } });
  
      if (location) {
        // Update the 'active' property
        await location.update({ active: !location.active });
  
        // Respond with a success status
        res.sendStatus(200);
      } else {
        // Location not found, respond with a 404 status
        res.sendStatus(404);
      }
   
    });
  
  app.use("/locations", router);
};
