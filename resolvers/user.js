const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { validateSignup, validatePasswordLength } = require('../validations');
const { isAuthenticated } = require('../midlewares/auth');

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
        const res = await User.createAccount(userData);
        if (!res) {
          throw new ApolloError(
            'User with the email or username already exists'
          );
        }
        return res;
      }
    ),
    userLogin: combineResolvers(
      async (root, args, { dataSources: { User } }) => {
        const user = await User.userLogin(args);
        if (!user) throw new Error('Invalid email or password');
        return user;
      }
    ),
    /**
     * Google Authentication Signup and Login
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User },
     *         app
     *       }
     * @returns user details
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

    /**
     *
     * Email Verification
     * @param {*} root
     * @param {*} { token }
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */
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
    },
    /**
     * Password Reset Mailer
     *
     * @param {*} root
     * @param {*} { email }
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */
    async sendResetPasswordEmail(
      root,
      { email },
      {
        dataSources: { User }
      }
    ) {
      const response = await User.sendResetPasswordEmail(email);
      if (!response) {
        throw new ApolloError(
          'The user with the specified email address does not exist'
        );
      }
      return response;
    },

    /**
     * Reset Password
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */

    resetPassword: combineResolvers(
      validatePasswordLength,
      async (root, args, { dataSources: { User } }) => {
        const response = await User.resetPassword(args);
        if (!response) {
          throw new ApolloError('Password reset failed, please try again');
        }
        return response;
      }
    ),
    updateProfile: combineResolvers(
      isAuthenticated,
      async (root, userData, { dataSources: { User }, user }) => {
        const res = await User.updateProfile(user.id, userData);
        if (!res) {
          throw new ApolloError('Profile update failed');
        }
        return res;
      }
    )
  }
};
