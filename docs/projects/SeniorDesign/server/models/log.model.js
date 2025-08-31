const {DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Logs = sequelize.define("logs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  action: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE
  }
}, {timestamps: false});

module.exports = Logs;