"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("character_movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      characterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "characters",
          key: "id",
        },
      },
      movieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("character_movies");
  },
};
