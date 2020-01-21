'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    pseudo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};