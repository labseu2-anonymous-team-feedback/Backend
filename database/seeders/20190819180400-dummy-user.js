const mockUsers = require('../mock/user.mock');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('Users', mockUsers, {}),

  /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {})
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
};
