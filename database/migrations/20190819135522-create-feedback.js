module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID
      },
      surveyId: {
        type: Sequelize.UUID
      },
      questionId: {
        type: Sequelize.UUID
      },
      comment: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Feedbacks')
};
