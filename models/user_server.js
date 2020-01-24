'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Server = sequelize.define('User_Server', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    server_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Servers',
        key: 'id'
      }
    }
  }, {});
  User_Server.associate = function(models) {
    // associations can be defined here
  };
  return User_Server;
};