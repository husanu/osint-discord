'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      pseudo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      twitch: {
        type: Sequelize.STRING
      },
      youtube: {
        type: Sequelize.STRING
      },
      battlenet: {
        type: Sequelize.STRING
      },
      steam: {
        type: Sequelize.STRING
      },
      reddit: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      spotify: {
        type: Sequelize.STRING
      },
      xbox: {
        type: Sequelize.STRING
      },
      leagueoflegends: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: "utf8mb4"
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};