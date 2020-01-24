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
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};