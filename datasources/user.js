const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const bcrypt = require('bcrypt');
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
    const hashedPassword = generateHash(userData.password);
    const user = this.models.User.create({
      ...userData,
      password: hashedPassword
    });
    return user;
  }

  async userLogin(credentials) {
    const errors = { error: 'Invalid username or password' };
    const user = await this.models.User.findOne({
      where: { email: credentials.email }
    });
    if (user) {
      const checkPassword = bcrypt.compareSync(
        credentials.password,
        user.dataValues.password
      );
      if (checkPassword) {
        const token = createToken({ __uuid: user.id });
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          token
        };
      }
      return errors;
    }
  }

  async getAllUsers() {
    return this.models.User.findAll();
  }

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
