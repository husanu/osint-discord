'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userID: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    pseudo: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    twitch: {
      type: DataTypes.STRING
    },
    youtube: {
      type: DataTypes.STRING
    },
    battlenet: {
      type: DataTypes.STRING
    },
    steam: {
      type: DataTypes.STRING
    },
    reddit: {
      type: DataTypes.STRING
    },
    facebook: {
      type: DataTypes.STRING
    },
    twitter: {
      type: DataTypes.STRING
    },
    spotify: {
      type: DataTypes.STRING
    },
    xbox: {
      type: DataTypes.STRING
    },
    leagueoflegends: {
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.Server, {
      through: 'User_Servers',
      as: 'servers',
      foreignKey: 'userID',
      otherKey: 'serverID'
    });
  };
  return User;
};