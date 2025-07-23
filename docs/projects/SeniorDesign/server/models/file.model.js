const {DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const GeneticId = require('./genetic-id.model');

const File = sequelize.define("files", {
  fileId: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fileData: {
    type: DataTypes.BLOB('medium'),
    allowNull: false,
    get() {
      return this.getDataValue('fileData').toString();
    },
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  associatedMaterial: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {timestamps: false});

module.exports = File;
