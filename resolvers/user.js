const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');
const { validateSignup } = require('../validations');

module.exports = {
  Query: {
    async getAllUsers(
      root,
      args,
      {
        dataSources: { User }
      }
    ) {
      const users = await User.getAllUsers();
      return users;
    },
    async getUserById(
      root,
      args,
      {
        dataSources: { User }
      }
    ) {
      const user = await User.getUserById(args);
      return user;
    }
  },
  User: {
    surveys(user) {
      return user.getSurveys();
    }
  },

  Mutation: {
    createAccount: combineResolvers(
      validateSignup,
      async (root, userData, { dataSources: { User } }) => {
        return User.createAccount(userData);
      }
    ),
    userLogin: combineResolvers(
      validateSignup,
      async (root, args, { dataSources: { User } }) => {
        const user = await User.userLogin(args);
        if (!user) throw new Error('Invalid email or password');
        return user;
      }
    ),
    /**
     *
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User },
     *         app
     *       }
     * @returns user deatails
     */
    async authGoogle(
      root,
      args,
      {
        dataSources: { User },
        app
      }
    ) {
      try {
        // app contains the accessToken, refreshToken and profile from passport
        const data = app.locals.profile;

        if (!data) {
          throw new AuthenticationError('Google Authentication Failed');
        }
        const user = await User.GoogleUser(data);
        if (user) {
          return user;
        }
      } catch (error) {
        return error;
      }
    },
    async verifyAccount(
      root,
      { token },
      {
        dataSources: { User }
      }
    ) {
      const response = User.verifyAccount(token);
      if (!response) {
        throw new AuthenticationError('Invalid verification link');
      }
      return response;
    }
  }
};
