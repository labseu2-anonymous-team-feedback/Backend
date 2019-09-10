const { skip } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');
/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const isAuthenticated = (parent, args, { user }) => {
  if (!user) {
    throw new AuthenticationError(
      'Unauthorized Request, Authentication required'
    );
  }
  return skip;
};

/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const isSurveyOwner = (parent, args, { user }) => {
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
  return skip;
};

module.exports = {
  isAuthenticated,
  isSurveyOwner
};
