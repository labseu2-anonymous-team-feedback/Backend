'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    surveyId: DataTypes.INTEGER,
    question: DataTypes.TEXT
  }, {});
  Question.associate = function(models) {
    // associations can be defined here
  };
  return Question;
};