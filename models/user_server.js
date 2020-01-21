'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Server = sequelize.define('User_Server', {
    user_id: DataTypes.INTEGER,
    server_id: DataTypes.INTEGER
  }, {});
  User_Server.associate = function(models) {
    // associations can be defined here
  };
  return User_Server;
};