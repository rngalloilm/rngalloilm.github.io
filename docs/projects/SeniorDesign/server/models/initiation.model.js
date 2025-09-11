const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Initiation = sequelize.define('Initiation', {

    initiationId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    seedsAndEmbryos: {
        type: DataTypes.INTEGER,
    },

    mediaBatch: {
        type: DataTypes.STRING,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    numberOfPlates: {
        type: DataTypes.INTEGER,
    },

    dateMade: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }
}, {timestamps: false});

Location.hasMany(Initiation, {
    foreignKey: "locationId"
});

Initiation.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Initiation, {
    foreignKey: "initiationGeneticId"
});

Initiation.belongsTo(GeneticId, {
    foreignKey: "initiationGeneticId"
});

module.exports = Initiation;
