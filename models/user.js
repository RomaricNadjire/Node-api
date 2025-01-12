"use strict";
const { Model } = require("sequelize");
const models = require("../models");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Ajoutez cette ligne
        autoIncrement: true, // Ajoutez cette ligne si vous souhaitez que l'id s'auto-incrémente
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // Ajoutez ceci si vous n'utilisez pas les champs createdAt et updatedAt automatiquement
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: "userId",
      as: "posts",
    });
  };

  return User;
};
