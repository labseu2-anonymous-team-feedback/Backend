const { skip } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');

const isAuthenticated = (parent, args, { user }) => {
  if (!user) {
    throw new AuthenticationError(
      'Unauthorized Request, Authentication required'
    );
  }
  return skip;
};

module.exports = {
  isAuthenticated
};
