require('dotenv').config();
const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { createToken, verifyUserToken } = require('../helpers/token');
const { generateMailTemplate, sendMail } = require('../helpers/mail');

class User extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  async createAccount(userData) {
    const user = await this.models.User.create({
      ...userData
    });
    await this.sendVerificationMail(user.get());
    return user;
  }

  async userLogin(credentials) {
    const user = await this.models.User.findOne({
      where: { email: credentials.email }
    });
    if (user) {
      const checkPassword = await user.validatePassword(credentials.password);
      if (checkPassword) {
        const token = createToken({ __uuid: user.id, username: user.username });
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

  async getUserById({ userId }) {
    return this.models.User.findOne({
      where: { id: userId }
    });
  }

  // eslint-disable-next-line no-unused-vars
  async GoogleUser({ accessToken, refreshToken, profile }) {
    const user = await this.models.User.findOne({
      where: { email: profile.emails[0].value },
      attributes: ['id', 'username', 'email']
    });
    // no user was found, lets create a new one
    if (!user) {
      const newUser = await this.models.User.create({
        username:
          profile.displayName || `${profile.familyName} ${profile.givenName}`,
        email: profile.emails[0].value,
        password: profile.id,
        token: accessToken
      });
      const token = await createToken({
        __uuid: newUser.get().id,
        username: newUser.get().username
      });
      return { ...newUser.get(), token };
    }
    const token = createToken({
      __uuid: user.get().id,
      username: user.get().username
    });
    return { ...user.get(), token };
  }

  // eslint-disable-next-line class-methods-use-this
  async sendVerificationMail(user) {
    const { id, username, email } = user;
    const token = createToken({ __uuid: id });
    const template = await generateMailTemplate({
      receiverName: username,
      intro: 'Welcome to Anonymous Team Feedback',
      text:
        'Your account is almost done. We only need to verify your email,Click the link below to verify your account',
      actionBtnText: 'Verify Account',
      actionBtnLink: `${process.env.CLIENT_URL}/${token}`
    });

    const msg = {
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Email Verification',
      html: template
    };
    return sendMail(msg);
  }

  // eslint-disable-next-line class-methods-use-this
  async verifyAccount(token) {
    const user = await verifyUserToken(token);
    if (user && user.verifyEmail()) {
      const authToken = createToken({ __uuid: user.id });
      return {
        ...user.get(),
        token: authToken
      };
    }
    return false;
  }
}

module.exports = User;
