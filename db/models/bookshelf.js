'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookshelf = sequelize.define('Bookshelf', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    deleteAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {});
  Bookshelf.associate = function(models) {
    Bookshelf.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Bookshelf;
};