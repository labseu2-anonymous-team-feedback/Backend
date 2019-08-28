require('dotenv').config();
const MailGen = require('mailgen');

const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: process.env.APP_NAME,
    link: 'https://anonymous-team-feeedback.herokuapp.com/',
    logo:
      'https://github.com/labseu2-anonymous-team-feedback/FE/blob/master/src/assets/images/logo.png?raw=true'
  }
});
module.exports = {
  mailGenerator
};
