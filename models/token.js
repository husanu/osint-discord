'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    value: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {});
  Token.associate = function(models) {
    // associations can be defined here
  };
  return Token;
};