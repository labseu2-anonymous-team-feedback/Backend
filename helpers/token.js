const jwt = require('jsonwebtoken');
require('dotenv').config();
const models = require('../database/models');

const SECRET = process.env.SECRET_KEY;
/**
 *
 *
 * @param {*} payload from id and username
 * @returns token
 */
const createToken = payload => {
  const token = jwt.sign(payload, SECRET, {
    expiresIn: 60 * 60 * 1440
  });
  return token;
};
/**
 * Decodes user token
 *
 * @param {*} token
 * @returns decoded token
 */
const decodeToken = async token => {
  try {
    const decoded = await jwt.verify(token, SECRET);
    if (decoded) {
      return decoded;
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * verify user token
 *
 * @param {*} token
 * @returns user with specified id in token
 */
const verifyUserToken = async token => {
  try {
    if (!token) return null;
    const { __uuid } = await decodeToken(token);
    const user = await models.User.findOne({ where: { id: __uuid } });
    if (user) {
      return user;
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createToken,
  verifyUserToken,
  decodeToken
};
