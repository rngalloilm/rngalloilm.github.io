module.exports = (app) => {
    const File = require('../models/file.model');
    const GeneticId = require('../models/genetic-id.model');
    let router = require('express').Router();
    const utils = require('./utils');
   
    // Retrieve all file associated with material
    router.get('/:associatedId', async (req, res) => {
      const materialId = req.params.associatedId;
      console.log("material ID", materialId);

      //const materialType = req.params.materialType;
     const materialExists = await utils.ensureMaterialIdExists(materialId);
      if (materialExists) {
        File.findAll({ 
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
          console.log("Unexpected Error in retrieving files. ", error);
          res.send(500);
        });
      } else {
       // console.log(materialType + " Id: " + materialId + " not found");
        res.sendStatus(404);
      }
    });
    

    // Add file to material
    router.post('/', async (req, res) => {
      try {
        const { materialId, fileData, fileName } = req.body;
    
        if (!materialId || !fileData || !fileName)
          return res.status(400).json({ error: 'Missing materialId, fileName, or fileData' });

        // const materialExists = await utils.ensureMaterialIdExists(materialType, materialId);
        // if(!materialExists)
        //   return res.status(404).json({error: `${materialType} Id: ${materialId} doesn't exist.`});
    
        const file = await File.create({
          associatedMaterial: materialId,
          fileData,
          fileName,
        });
    
        res.status(200).json(file);
      } catch (error) {
        console.error("Error Inserting File: ", error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    // Delete a file from the database
    router.delete('/:id', async (req, res) => {
        const reqFileID = req.params.id;
        const file = await File.findOne({ where: { fileId: reqFileID } });
        if (file) {
            file.destroy();
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    app.use('/files', router);
}
