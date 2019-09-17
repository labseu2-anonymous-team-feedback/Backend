module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'Feedback',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.UUID,
      surveyId: DataTypes.UUID,
      questionId: DataTypes.UUID,
      comment: DataTypes.TEXT,
      rating: DataTypes.STRING
    },
    {}
  );
  Feedback.associate = (models) => { // eslint-disable-line
    // associations can be defined here
    Feedback.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
    Feedback.belongsTo(models.Survey, {
      foreignKey: 'surveyId',
      as: 'survey'
    });
    Feedback.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  };
  return Feedback;
};
