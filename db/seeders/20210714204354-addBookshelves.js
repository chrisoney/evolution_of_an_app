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
        name: 'Read',
        deleteAllowed: false
      },
      {
        userId: 1,
        name: 'Currently Reading',
        deleteAllowed: false,
      },
      {
        userId: 1,
        name: 'Want To Read',
        deleteAllowed: false,
      },
      {
        userId: 1,
        name: 'LitRpg',
        deleteAllowed: true,
      },
      {
        userId: 2,
        name: 'Read',
        deleteAllowed: false,
      },
      {
        userId: 2,
        name: 'Currently Reading',
        deleteAllowed: false,
      },
      {
        userId: 2,
        name: 'Want To Read',
        deleteAllowed: false,
      },
      {
        userId: 2,
        name: 'Favorites',
        deleteAllowed: true
      },
      {
        userId: 3,
        name: 'Read',
        deleteAllowed: false,
      },
      {
        userId: 3,
        name: 'Currently Reading',
        deleteAllowed: false,
      },
      {
        userId: 3,
        name: 'Want To Read',
        deleteAllowed: false,
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
