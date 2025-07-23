const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const Tree = require('./tree.model');

const Ramet = sequelize.define("ramets", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  gps: {
    type: DataTypes.STRING,
  },
  transferDate: {
    type: DataTypes.DATE,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
  isCheckedOut: {
    type: DataTypes.BOOLEAN,
  },
  checkedOutBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {timestamps: false});

Location.hasMany(Ramet, {
  foreignKey: "locationId"
});
Ramet.belongsTo(Location, {
  foreignKey: "locationId"
});

GeneticId.hasMany(Ramet, {
  foreignKey: "rametGeneticId"
});
Ramet.belongsTo(GeneticId, {
  foreignKey: "rametGeneticId"
});

Tree.hasMany(Ramet, {
  foreignKey: "motherTreeId"
});
Ramet.belongsTo(Tree, {
  foreignKey: "motherTreeId"
});

module.exports = Ramet;
