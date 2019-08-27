const { skip } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server-express');

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const validateSignup = (parent, args, ctx) => {
  const { password } = args;
  if (password.length < 8) {
    throw new UserInputError('Password must be at least 8 characters long', {
      invalidArgs: 'password'
    });
  }
  return skip;
};

module.exports = {
  validateSurvey,
  validateSignup
};
