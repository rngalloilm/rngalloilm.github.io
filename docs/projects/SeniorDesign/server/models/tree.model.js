const {DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Location = require('./locations.model');
const GeneticId = require('./genetic-id.model');


const Tree = sequelize.define("trees", {
  treeId: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
  gps: {
    type: DataTypes.STRING,
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

Location.hasMany(Tree, {
  foreignKey: "locationId"
});
Tree.belongsTo(Location, {
  foreignKey: "locationId"
});
GeneticId.hasMany(Tree, {
  foreignKey: "treeGeneticId"
});
Tree.belongsTo(GeneticId, {
  foreignKey: "treeGeneticId"
});


module.exports = Tree;
