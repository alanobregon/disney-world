"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Character.belongsToMany(models.Movie, {
        through: "CharacterMovie",
        foreignKey: "characterId",
        as: "movies",
      });
    }
  }
  Character.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.BLOB,
      age: DataTypes.INTEGER,
      weight: DataTypes.DOUBLE,
      story: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Character",
    }
  );
  return Character;
};
