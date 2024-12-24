"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("chats", "sender", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropColumn("chats", "sender");
  },
};
