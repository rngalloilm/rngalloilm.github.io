const {DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Population = require("./population.model");
// const Ramet = require('./ramet.model');

const GeneticId = sequelize.define("geneticIds", {
  id: {
    type: DataTypes.INTEGER(9),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }, 
  geneticId: {
    type: DataTypes.STRING(9),
  },
  familyId: {
    type: DataTypes.STRING(9),
  },
  rametId: {
    type: DataTypes.STRING(9),
    allowNull: true,
  },
  progenyId: {
    type: DataTypes.STRING(9),
  },
  species: {
    type: DataTypes.STRING,
  },
  yearPlanted: {
    type: DataTypes.STRING,
    allowNull: true,
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
}, {
  timestamps: false, 
  indexes: [
    {
      name: 'geneticIdIndex',
      unique: true,
      fields: ['geneticId', 'familyId', 'rametId', 'progenyId', 'populationId']
    }
  ]
});

Population.hasMany(GeneticId, {
  foreignKey: "populationId"
});
GeneticId.belongsTo(Population);
// Ramet.hasMany(GeneticId, {
//   foreignKey: "rametId",
//   allowNull: true
//   });
// GeneticId.belongsTo(Ramet);

module.exports = GeneticId;
