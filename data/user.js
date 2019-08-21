const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const bcrypt = require('bcrypt');
const createToken = require('../helpers/token');

class User extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  async userLogin(credentials) {
    const errors = { error: 'Invalid username or password' };
    const user = await this.models.User.findOne({
      where: { email: credentials.email },
    });
    if (user) {
      const checkPassword = bcrypt.compareSync(credentials.password, user.dataValues.password);
      if (checkPassword) {
        const token = createToken(user);
        return {
          id: user.id, email: user.email, usernname: user.username, token,
        };
      }
      return errors;
    }
  }
}

module.exports = User;
