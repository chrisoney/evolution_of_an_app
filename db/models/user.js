'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    demo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Bookshelf, { foreignKey: 'userId' });
  };
  return User;
};