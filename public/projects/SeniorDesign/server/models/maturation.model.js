const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Maturation = sequelize.define('Maturation', {

    maturationId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    numberOfPlates: {
        type: DataTypes.INTEGER
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    mediaBatch: {
        type: DataTypes.STRING
    },

    dateMatured: {
        type: DataTypes.DATE
    },

    active: {
        type: DataTypes.BOOLEAN
    }

}, {timestamps: false});

Location.hasMany(Maturation, {
    foreignKey: "locationId"
});

Maturation.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Maturation, {
    foreignKey: "maturationGeneticId"
});

Maturation.belongsTo(GeneticId, {
    foreignKey: "maturationGeneticId"
});

module.exports = Maturation;
