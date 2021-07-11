"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CharacterMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CharacterMovie.belongsTo(models.Movie, { foreignKey: "movieId" });
      CharacterMovie.belongsTo(models.Character, { foreignKey: "characterId" });
    }
  }
  CharacterMovie.init(
    {
      characterId: DataTypes.INTEGER,
      movieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CharacterMovie",
    }
  );
  return CharacterMovie;
};
