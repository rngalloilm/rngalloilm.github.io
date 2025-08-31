const {DataTypes}  = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const ColdTreatment = sequelize.define('ColdTreatment', {

    coldTreatmentId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    numberEmbryos: {
        type: DataTypes.INTEGER,
    },

    dateCold: {
        type: DataTypes.DATE,
    },

    duration: {
        type: DataTypes.STRING,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }
}, {timestamps: false});

Location.hasMany(ColdTreatment, {
    foreignKey: "locationId"
});

ColdTreatment.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(ColdTreatment, {
    foreignKey: "coldTreatmentGeneticId"
});

ColdTreatment.belongsTo(GeneticId, {
    foreignKey: "coldTreatmentGeneticId"
});

module.exports = ColdTreatment;
