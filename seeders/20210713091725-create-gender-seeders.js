"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Genders", [
      {
        name: "Animation",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Comedy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fantasy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Musical",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Action / Adventure",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Genders", null, {});
  },
};
