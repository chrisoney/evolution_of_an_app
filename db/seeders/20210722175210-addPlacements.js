'use strict';
const { Story, sequelize } = require('../models');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    
    const addStories = async (standardShelves, customShelf = null) => {
      const result = []
      const stories = await Story.findAll({
        order: sequelize.random(),
        limit: 9
      })
    
      const faveStories = stories.filter(story => story.id % 2 === 1)
    
      const distribution = [4,3,2]
      for (let i = 0; i < standardShelves.length; i++){
        let shelf = standardShelves[i];
        let numStories = distribution[i];
        while (numStories > 0) {
          const story = stories.shift();
          result.push({ bookshelfId: shelf, storyId: story.id })
          numStories -= 1;
        }
      }
      if (customShelf) {        
        for (let j = 0; j < faveStories.length; j++){
          let story = faveStories[j];
          result.push({ bookshelfId: customShelf, storyId: story.id })
        }
      }
      return result;
    }

    const values = [];
    // User 1
    const res1 = await addStories([1, 2, 3], 4);
    const res2 = await addStories([5, 6, 7], 8);
    const res3 = await addStories([9, 10, 11]);
    values.push(...res1, ...res2, ...res3)
    
    return queryInterface.bulkInsert('Placements', values, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Placements', null, { truncate: true,cascade: true, resetIdentity: true });
  }
};
