'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Users', [
      {
        username: 'Main_Character',
        email: 'demo@demo.com',
        hashedPassword: bcrypt.hashSync('hunter12'),
        demo: false,
      },
      {
        username: 'Chris',
        email: 'chris@chris.com',
        hashedPassword: bcrypt.hashSync('hunter12'),
        demo: false,
      },
      {
        username: 'Matt',
        email: 'matt@matt.com',
        hashedPassword: bcrypt.hashSync('hunter12'),
        demo: false,
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Users', null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
