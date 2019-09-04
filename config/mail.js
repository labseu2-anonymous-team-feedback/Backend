require('dotenv').config();
const MailGen = require('mailgen');

const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: process.env.APP_NAME,
    link: process.env.MAIL_LINK,
    logo: process.env.MAIL_LOGO
  }
});
module.exports = {
  mailGenerator
};
