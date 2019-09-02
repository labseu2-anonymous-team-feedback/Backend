require('dotenv').config();
const { Op } = require('sequelize');
const { DataSource } = require('apollo-datasource');
const bcrypt = require('bcrypt');
const autoBind = require('auto-bind');
const { createToken, verifyUserToken } = require('../helpers/token');
const { generateMailTemplate, sendMail } = require('../helpers/mail');

/**
 *
 *
 * @class User
 * @extends {DataSource}
 */
class User extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  /**
   *
   *
   * @param {*} userData
   * @returns
   * @memberof User
   */
  async createAccount(userData) {
    const { email, username }= userData;
    const [user, created] = await this.models.User.findOrCreate({
      where: {
        [Op.or]: [{ username }, { email }],
      },
      defaults: userData
    });
    if (created) {
      await this.sendVerificationMail(user.get());
      return user;
    }
    return false;
  }

  /**
   *
   *
   * @param {*} credentials
   * @returns
   * @memberof User
   */
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

  /**
   *
   *
   * @returns
   * @memberof User
   */
  async getAllUsers() {
    return this.models.User.findAll();
  }

  /**
   *
   *
   * @param {*} { userId }
   * @returns
   * @memberof User
   */
  async getUserById({ userId }) {
    return this.models.User.findOne({
      where: { id: userId }
    });
  }

  /**
   * Google Authentication Database query
   *
   * @param {*} profile
   * @returns
   * @memberof User
   */
  async GoogleUser({ displayName, familyName, givenName, emails, id }) {
    const user = await this.models.User.findOne({
      where: { email: emails[0].value },
      attributes: ['id', 'username', 'email']
    });
    // no user was found, lets create a new one
    if (!user) {
      const newUser = await this.models.User.create({
        username: displayName || `${familyName} ${givenName}`,
        email: emails[0].value,
        password: id
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
      actionBtnLink: `${process.env.CLIENT_URL}/verify_account/${token}`
    });

    const msg = {
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Email Verification',
      html: template
    };
    return sendMail(msg);
  }

  /**
   *
   * Verify User email
   * @param {string} token - verification token
   * @returns {object} { User, token}
   * @memberof User
   */
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

  async sendResetPasswordEmail(email) {
    const user = await this.models.User.findOne({ where: { email } });
    if (!user) return null;
    const token = createToken({ __uuid: user.id });
    const template = await generateMailTemplate({
      receiverName: user.username,
      intro: 'Password Reset',
      text:
        'You recently requested for password reset. If this is you, kindly click the link below to reset your password.',
      actionBtnText: 'Reset Password',
      actionBtnLink: `${process.env.CLIENT_URL}/password_reset/${token}`
    });

    const msg = {
      to: user.email,
      from: process.env.MAIL_FROM,
      subject: 'Password Reset',
      html: template
    };
    const sent = await sendMail(msg);
    if (sent) return { message: 'Password Reset link sent successfully' };
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  async resetPassword(userData) {
    const { newPassword, token } = userData;
    const user = await verifyUserToken(token);
    if (!user) return false;
    const hashedPassword = await bcrypt.hashSync(newPassword, 10);
    const isUpdated = await user.update({ password: hashedPassword });
    if (isUpdated) return { message: 'Password updated successfully' };
    return false;
  }
}

module.exports = User;
