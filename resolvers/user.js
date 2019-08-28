const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');
const { validateSignup } = require('../validations');
const { authenticateGoogle } = require('../auth/passportConfig');

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
    async authGoogle(
      root,
      {
        googleAccessToken: { accessToken }
      },
      {
        dataSources: { User },
        req,
        res
      }
    ) {
      req.body = {
        ...req.body,
        access_token: accessToken
      };

      try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(req, res);
        // console.log(data, info);
        if (data) {
          const user = await User.GoogleUser(data);
          if (user) {
            return user;
          }
        }

        if (info) {
          switch (info.code) {
            case 'ETIMEDOUT':
              return new Error('Failed to reach Google: Try Again');
            default:
              return new Error('something went wrong');
          }
        }
        return Error('server error');
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
