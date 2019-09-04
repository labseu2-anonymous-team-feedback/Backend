module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      surveyId: {
        type: Sequelize.UUID
      },
      question: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM('text', 'rating'),
        defaultValue: 'text'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Questions')
};
