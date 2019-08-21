module.exports = {
  Query: {
    async getAllUsers(root, args, { models }) {
      const users = await models.User.findAll();
      return users;
    },
  },
  User: {
    surveys(user) {
      return user.getSurveys();
    },
  },

  Mutation: {
    async userLogin(root, args, { dataSources: { User } }) {
      const user = await User.userLogin(args);
      return user;
    },
  },
};
