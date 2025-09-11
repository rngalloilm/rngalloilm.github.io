async function ensureMaterialIdExists(id) {
    const models = {
        'location': require('../models/locations.model'),
        'population': require("../models/population.model"),
        'trees': require("../models/tree.model"),
        'species': require("../models/species.model"),
        'ramet-material': require("../models/ramet.model"),
        'cones': require("../models/cone.model"),
        'seed-material': require("../models/seed.model"),
        'initiation': require("../models/initiation.model"),
        'maintenance': require("../models/maintenance.model"),
        'acclimation': require("../models/acclimation.model"),
        'cold-treatment': require("../models/coldtreatment.model"),
        'germination': require("../models/germination.model"),
        'fieldstation': require("../models/fieldstation.model"),
        'maturation': require("../models/maturation.model"),
        'greenhouse': require("../models/greenhouse.model"),
    };

    for (const type in models) {
        
        const model = models[type];
        if (type === 'location'){
            const locInstatnce = await model.findOne({where: {uniqueId: id} });
            if(locInstatnce !== null){
                return true;
            }
        }
        const instance = await model.findByPk(id);
        if (instance !== null) {
            
            return true;
        }
       
    }

    return false;
}

module.exports = { ensureMaterialIdExists };
