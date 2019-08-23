module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      surveyId: DataTypes.INTEGER,
      question: DataTypes.TEXT
    },
    {}
  );
  Question.associate = (models) => {
    // associations can be defined here
  };
  return Question;
};
