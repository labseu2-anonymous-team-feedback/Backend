const { skip } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server-express');

const validateSurvey = (parent, { input }, ctx) => {
  const { title, questions } = input;
  if (!title) {
    throw new UserInputError('You must specify the title of the survey', {
      invalidArgs: 'title'
    });
  }
  if (!questions.length) {
    throw new UserInputError('The survey questions cannot be empty', {
      invalidArgs: 'questions'
    });
  }
  questions.forEach(q => {
    if (!q.question) {
      throw new UserInputError('A question must have the question field', {
        invalidArgs: 'questions'
      });
    }
  });
  return skip;
};

module.exports = {
  validateSurvey
};
