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
      return user;
    },

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
          console.log(info);
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
    }
  }
};
