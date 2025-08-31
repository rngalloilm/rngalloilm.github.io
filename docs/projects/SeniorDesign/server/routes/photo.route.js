module.exports = (app) => {
    const Photo = require('../models/photo.model');
    let router = require('express').Router();
    let utils = require('./utils');

    // Retrieve all photos associated with material
    router.get('/:associatedId', async (req, res) => {
      const materialId = req.params.associatedId;
      console.log("material ID", materialId);
     const materialExists = await utils.ensureMaterialIdExists(materialId);
      if (materialExists) {
        Photo.findAll({ 
          where: { 
            associatedMaterial: materialId
          }
        }).then((innerRes) => {
          if(innerRes) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
          } else {
            res.sendStatus(404);
          }
        }).catch((error) => {
          console.log("Unexpected Error in retrieving photos. ", error);
          res.send(500);
        });
      } else {
        console.log(" Id: " + materialId + " not found");
        res.sendStatus(404);
      }
    });
    
    // Add photo to material
    router.post('/', async (req, res) => {
      try {
        const { materialId, photoData } = req.body;
        if (!materialId || !photoData )
          return res.status(400).json({ error: 'Missing materialId or photoData' });
    
        const photo = await Photo.create({
          associatedMaterial: materialId,
          photoData,
        });
    
        res.status(200).json(photo);
      } catch (error) {
        console.error("Error Inserting Photo: ", error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    // Delete a photo from the database
    router.delete('/:id', async (req, res) => {
        const reqPhotoID = req.params.id;
        const photo = await Photo.findOne({ where: { photoId: reqPhotoID } });
        if (photo) {
            photo.destroy();
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    app.use('/photos', router);
}
