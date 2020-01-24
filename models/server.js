'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverID: {
      allowNull: false,
      type: DataTypes.STRING
    },
    link: {
      allowNull: false,
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