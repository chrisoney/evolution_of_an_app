'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Bookshelves', [
      {
        userId: 1,
        name: 'Read'
      },
      {
        userId: 1,
        name: 'Currently Reading'
      },
      {
        userId: 1,
        name: 'Want To Read'
      },
      {
        userId: 2,
        name: 'Read'
      },
      {
        userId: 2,
        name: 'Currently Reading'
      },
      {
        userId: 2,
        name: 'Want To Read'
      },
      {
        userId: 2,
        name: 'Favorites'
      },
      {
        userId: 3,
        name: 'Read'
      },
      {
        userId: 3,
        name: 'Currently Reading'
      },
      {
        userId: 3,
        name: 'Want To Read'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Bookshelves', null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
