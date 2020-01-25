'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Server = sequelize.define('User_Server', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    server_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  User_Server.associate = function(models) {
    // associations can be defined here
  };
  return User_Server;
};