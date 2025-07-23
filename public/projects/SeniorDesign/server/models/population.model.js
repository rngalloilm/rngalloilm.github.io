const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Population = sequelize.define("population", {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(9),
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

module.exports = Population;
