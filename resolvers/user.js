const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { validateSignup } = require('../validations');

module.exports = {
  Query: {
    /**
     * Get All Users in database
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */
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
    /**
     * Get user by id
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */
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
    /**
     * verify users email
     *
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
     * send email to user to reset password
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
     * reset user password
     *
     * @param {*} root
     * @param {*} args
     * @param {*} {
     *         dataSources: { User }
     *       }
     * @returns
     */
    async resetPassword(
      root,
      args,
      {
        dataSources: { User }
      }
    ) {
      const response = await User.resetPassword(args);
      if (!response) {
        throw new ApolloError('Password reset failed, please try again');
      }
      return response;
    }
  }
};
