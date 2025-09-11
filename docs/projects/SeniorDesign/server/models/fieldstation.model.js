const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const FieldStation = sequelize.define('FieldStation', {

    fieldStationId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    datePlanted: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }

}, {timestamps: false});

Location.hasMany(FieldStation, {
    foreignKey: "locationId"
});

FieldStation.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(FieldStation, {
    foreignKey: "fieldStationGeneticId"
});

FieldStation.belongsTo(GeneticId, {
    foreignKey: "fieldStationGeneticId"
});

module.exports = FieldStation;
