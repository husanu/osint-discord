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
    User.belongsTo(models.Server, {
      through: 'User_Servers',
      //as: 'servers',
      foreignKey: 'userID',
      otherKey: 'serverID'
    });
  };
  return User;
};