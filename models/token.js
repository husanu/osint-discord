'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    value: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId:{
      type: DataTypes.STRING
    }
  }, {});
  Token.associate = function(models) {
    // associations can be defined here
  };
  return Token;
};