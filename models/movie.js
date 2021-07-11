"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.Gender, { foreignKey: "genderId", as: "gender" });
      Movie.belongsToMany(models.Character, {
        through: "character_movies",
        foreignKey: "movieId",
        as: "movies",
      });
    }
  }
  Movie.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.BLOB,
      score: DataTypes.INTEGER,
      genderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
