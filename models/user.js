"use strict";
const { Model } = require("sequelize");

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
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false, // Ajoutez ceci si vous n'utilisez pas les champs createdAt et updatedAt automatiquement
    }
  );

  return User;
};
