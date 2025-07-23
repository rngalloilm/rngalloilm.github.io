const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');
const Tree = require('./tree.model');
const Ramet = require('./ramet.model');


const Cone = sequelize.define("cones", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dateHarvested: {
    type: DataTypes.DATE
  },
  active: {
    type: DataTypes.BOOLEAN
  },
  isCheckedOut: {
    type: DataTypes.BOOLEAN,
  },
  checkedOutBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {timestamps: false});

Location.hasMany(Cone, {
  foreignKey: 'locationId'
})
Cone.belongsTo(Location, {
  foreignKey: 'locationId'
})

GeneticId.hasMany(Cone, {
  foreignKey: 'coneGeneticId'
})
Cone.belongsTo(GeneticId, {
  foreignKey: 'coneGeneticId'
})

Tree.hasMany(Cone, {
  foreignKey: {
    name: 'motherTreeId',
    allowNull: true,
  }
})
Cone.belongsTo(Tree, {
  foreignKey: {
    name: 'motherTreeId',
    allowNull: true,
  }
})

Tree.hasMany(Cone, {
  foreignKey: {
    name: 'fatherTreeId',
    allowNull: true
  }
})
Cone.belongsTo(Tree, {
  foreignKey: {
    name: 'fatherTreeId',
    allowNull: true
  }
})

module.exports = Cone;
