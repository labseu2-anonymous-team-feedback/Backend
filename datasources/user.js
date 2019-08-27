const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { createToken } = require('../helpers/token');
const { generateHash } = require('../helpers/hash');

class User extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  async createAccount(userData) {
    const user = this.models.User.create({
      ...userData
    });
    return user;
  }

  async userLogin(credentials) {
    const user = await this.models.User.findOne({
      where: { email: credentials.email }
    });
    if (user) {
      const checkPassword = await user.validatePassword(credentials.password);
      if (checkPassword) {
        const token = createToken({ __uuid: user.id });
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          token
        };
      }
      return null;
    }
  }

  async getAllUsers() {
    return this.models.User.findAll();
  }

  // eslint-disable-next-line no-unused-vars
  async GoogleUser({ accessToken, refreshToken, profile }) {
    const user = await this.models.User.findOne({
      where: { email: profile.emails[0].value },
      attributes: ['id', 'username', 'email']
    });
    // no user was found, lets create a new one
    if (!user) {
      const hashedPassword = generateHash(profile.id);
      const newUser = await this.models.User.create({
        username:
          profile.displayName || `${profile.familyName} ${profile.givenName}`,
        email: profile.emails[0].value,
        password: hashedPassword,
        token: accessToken
      });
      return newUser.get();
    }
    const token = createToken({ __uuid: user.get().id });
    return { ...user.get(), token };
  }
}

module.exports = User;
