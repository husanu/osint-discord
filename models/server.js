'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverId: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    parsed: {
      type: DataTypes.TINYINT
    }
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};