const {DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const GeneticId = require('./genetic-id.model');

const Photo = sequelize.define("photos", {
  photoId: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photoData: {
    type: DataTypes.BLOB('medium'),
    allowNull: false,
    get() {
      return this.getDataValue('photoData').toString();
    },
  },
  associatedMaterial: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {timestamps: false});

module.exports = Photo;
