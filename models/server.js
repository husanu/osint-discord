'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverId: DataTypes.STRING,
    link: DataTypes.STRING,
    name: DataTypes.STRING,
    parsed: DataTypes.TINYINT
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};