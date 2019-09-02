const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
/**
 * generate hash for password
 *
 * @param {*} password from user request body
 * @returns hashed password
 */
const generateHash = password => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = {
  generateHash
};
