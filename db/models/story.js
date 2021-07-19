'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.TEXT,
    pageCount: DataTypes.INTEGER,
    linkUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    warnings: DataTypes.JSONB,
    status: DataTypes.STRING
  }, {});
  Story.associate = function(models) {
    Story.hasMany(models.Placement, { foreignKey: 'storyId', onDelete: 'CASCADE', hooks: true })
    
    const columnMapping = {
      through: 'Placement',
      foreignKey: 'storyId',
      otherKey: 'bookshelfId'
    }
    Story.belongsToMany(models.Bookshelf, columnMapping)
  };
  return Story;
};