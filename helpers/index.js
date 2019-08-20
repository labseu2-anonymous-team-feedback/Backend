const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();


const generateHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = {
  generateHash,
};
