const { skip } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server-express');

/**
 * Validate Survey
 *
 * @param {*} parent
 * @param {*} { input }
 * @param {*} ctx
 * @returns
 */
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

/**
 * Validate Signup
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} ctx
 * @returns
 */
const validateSignup = (parent, args, ctx) => {
  const { password, username } = args;
  if (password.length < 8) {
    throw new UserInputError('Password must be at least 8 characters long', {
      invalidArgs: 'password'
    });
  }

  if (username.length < 3 || username.length > 30) {
    throw new UserInputError(
      'Username must be between 3 to 30 characters long',
      {
        invalidArgs: 'username'
      }
    );
  }
  return skip;
};

const validateLogin = (parent, args, ctx) => {
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
  validateSignup,
  validateLogin
};
