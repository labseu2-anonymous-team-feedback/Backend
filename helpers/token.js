const jwt = require('jsonwebtoken');
require('dotenv').config();
const models = require('../database/models');

const SECRET = process.env.SECRET_KEY;
/**
 * Create JWT
 *
 * @param {*} payload
 * @returns
 */
const createToken = payload => {
  const token = jwt.sign(payload, SECRET, {
    expiresIn: 60 * 60 * 1440
  });
  return token;
};
/**
 * JWT decode
 *
 * @param {*} token
 * @returns
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
 * JWT verify
 *
 * @param {*} token
 * @returns
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
