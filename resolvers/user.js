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
    }
  },
  User: {
    surveys(user) {
      return user.getSurveys();
    }
  },

  Mutation: {
    async createAccount(
      root,
      userData,
      {
        dataSources: { User }
      }
    ) {
      return User.createAccount(userData);
    },
    async userLogin(
      root,
      args,
      {
        dataSources: { User }
      }
    ) {
      const user = await User.userLogin(args);
      if (!user) throw new Error('Invalid email or password');
      return user;
    }
  }
};
