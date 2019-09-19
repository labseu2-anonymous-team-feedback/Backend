const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
/**
 * Bcrypt Password hash
 *
 * @param {*} password
 * @returns
 */
const generateHash = password => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = {
  generateHash
};
