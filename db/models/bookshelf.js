'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookshelf = sequelize.define('Bookshelf', {
    userId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 30]
      }
    },
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