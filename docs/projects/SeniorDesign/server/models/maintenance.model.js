const {DataTypes} = require('sequelize');

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const sequelize = require("../database/database");

const Maintenance = sequelize.define('Maintenance', {

    maintenanceId: {
        primaryKey: true,
        type: DataTypes.STRING,
    },

    numberOfPlates: {
        type: DataTypes.INTEGER,
    },

    mediaBatchCurr: {
        type: DataTypes.STRING,
    },

    dateCurr: {
        type: DataTypes.DATE,
    },

    transferDate: {
        type: DataTypes.DATE,
    },

    mediaBatchPrev: {
        type: DataTypes.STRING,
    },

    datePrev: {
        type: DataTypes.DATE,
    },

    active: {
        type: DataTypes.BOOLEAN,
    }
}, {timestamps: false});

Location.hasMany(Maintenance, {
    foreignKey: "locationId"
});

Maintenance.belongsTo(Location, {
    foreignKey: "locationId"
});

GeneticId.hasMany(Maintenance, {
    foreignKey: "maintenanceGeneticId"
});

Maintenance.belongsTo(GeneticId, {
    foreignKey: "maintenanceGeneticId"
});

module.exports = Maintenance;
