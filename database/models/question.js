module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      surveyId: DataTypes.UUIDV4,
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
    Question.hasMany(models.Feedback, {
      foreignKey: 'questionId',
      as: 'feedbacks',
      onDelete: 'CASCADE'
    });
  };
  return Question;
};
