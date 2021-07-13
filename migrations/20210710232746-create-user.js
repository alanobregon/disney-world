"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstname: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      lastname: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(254),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
