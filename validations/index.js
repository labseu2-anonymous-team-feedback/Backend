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
  if (password.length < 6) {
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

const validatePasswordLength = (parent, args, ctx) => {
  const { newPassword } = args;
  if (newPassword.length < 6) {
    throw new UserInputError('Password must be at least 6 characters long', {
      invalidArgs: 'password'
    });
  }
  return skip;
};

const validateFeedback = (parent, { input }, ctx) => {
  const { surveyId, responses } = input;
  if (!surveyId) {
    throw new UserInputError('Survey id must be present', {
      invalidArgs: 'surveyId'
    });
  }
  for (let i = 0; i < responses.length; i += 1) {
    if (!responses[i].questionId) {
      throw new UserInputError('Question id must be present in all responses', {
        invalidArgs: 'responses'
      });
    } else if (
      (!responses[i].comment && !responses[i].rating) ||
      (responses[i].comment && responses[i].rating)
    ) {
      throw new UserInputError(
        'Either content or rating must be present in all responses',
        {
          invalidArgs: 'responses'
        }
      );
    } else if (
      responses[i].rating &&
      (!Number.isInteger(parseInt(responses[i].rating, 10)) ||
        (parseInt(responses[i].rating, 10) < 1 ||
          parseInt(responses[i].rating, 10) > 10))
    ) {
      throw new UserInputError(
        'Ratings must be between 1 and 10 in all responses with ratings',
        {
          invalidArgs: 'responses'
        }
      );
    }
  }
  return skip;
};

module.exports = {
  validateSurvey,
  validateSignup,
  validatePasswordLength,
  validateFeedback
};
