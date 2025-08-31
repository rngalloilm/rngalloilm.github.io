const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Germination = sequelize.define('Germination', {

    germinationId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    numberEmbryos: {
        type: DataTypes.INTEGER,
    },

    mediaBatch: {
        type: DataTypes.STRING,
    },

    dateGermination: {
        type: DataTypes.DATE,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }
}, {timestamps: false});

Location.hasMany(Germination, {
    foreignKey: "locationId"
});

Germination.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Germination, {
    foreignKey: "germinationGeneticId"
});

Germination.belongsTo(GeneticId, {
    foreignKey: "germinationGeneticId"
});

module.exports = Germination;
