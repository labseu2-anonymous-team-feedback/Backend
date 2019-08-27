module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      surveyId: DataTypes.INTEGER,
      question: DataTypes.TEXT,
      type: DataTypes.ENUM('text', 'rating')
    },
    {}
  );
  Question.associate = models => {
    Question.belongsTo(models.Survey, {
      foreignKey: 'surveyId',
      as: 'survey'
    });
  };
  return Question;
};
