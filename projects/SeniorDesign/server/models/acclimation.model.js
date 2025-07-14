const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Acclimation = sequelize.define('Acclimation', {

    acclimationId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    dateAcclimation: {
        type: DataTypes.DATE,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }

}, {timestamps: false});

Location.hasMany(Acclimation, {
    foreignKey: "locationId"
});

Acclimation.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Acclimation, {
    foreignKey: "acclimationGeneticId"
});

Acclimation.belongsTo(GeneticId, {
    foreignKey: "acclimationGeneticId"
});

module.exports = Acclimation;
