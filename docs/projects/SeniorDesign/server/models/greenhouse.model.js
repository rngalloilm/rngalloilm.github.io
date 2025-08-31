const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Greenhouse = sequelize.define('Greenhouse', {

    greenhouseId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    dateGreenhouse: {
        type: DataTypes.DATE,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }

}, {timestamps: false});

Location.hasMany(Greenhouse, {
    foreignKey: "locationId"
});

Greenhouse.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Greenhouse, {
    foreignKey: "greenhouseGeneticId"
});

Greenhouse.belongsTo(GeneticId, {
    foreignKey: "greenhouseGeneticId"
});

module.exports = Greenhouse;
