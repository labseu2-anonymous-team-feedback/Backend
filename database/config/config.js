require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: process.env.DIALECT,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: process.env.DIALECT,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DIALECT,
  },
}