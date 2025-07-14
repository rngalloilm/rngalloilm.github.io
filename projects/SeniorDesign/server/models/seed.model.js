const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require("../database/database");

const Tree = require("./tree.model");
const Cone = require("./cone.model");
const Location = require("./locations.model");
const GeneticId = require("./genetic-id.model");

const Seed = sequelize.define("seeds", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  origin: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  dateMade: {
    type: DataTypes.DATE
  },
  transferDate: {
    type: DataTypes.DATE,
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

GeneticId.hasMany(Seed, {
  foreignKey: "seedGeneticId"
});
Seed.belongsTo(GeneticId, {
  foreignKey: "seedGeneticId"
});

Tree.hasMany(Seed, {
  foreignKey: {
    name: "motherTreeId",
    allowNull: true
  }
});
Seed.belongsTo(Tree, {
  foreignKey: {
    name: "motherTreeId",
    allowNull: true
  }
});

Tree.hasMany(Seed, {
  foreignKey: {
    name: "fatherTreeId",
    allowNull: true
  }
});
Seed.belongsTo(Tree, {
  foreignKey: {
    name: "fatherTreeId",
    allowNull: true
  }
});

Cone.hasMany(Seed, {
  foreignKey: {
    name: "coneId",
    allowNull: true
  }
});
Seed.belongsTo(Cone, {
  foreignKey: {
    name: "coneId",
    allowNull: true
  }
});

Location.hasMany(Seed, {
  foreignKey: {
    name: "locationId"
  }
});
Seed.belongsTo(Location, {
  foreignKey: {
    name: "locationId",
  }
});

module.exports = Seed;
