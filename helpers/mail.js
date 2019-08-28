const sgMail = require('@sendgrid/mail');
const { mailGenerator } = require('../config/mail');

/**
 *
 * Generates html email template for the email
 * @param {object} options - Info needed to generate the email template
 * @param { string } options['receiverName']  Name of the recipient
 * @param { string } options['intro'] The email salutation
 * @param { string } options['text']  The text for the email
 * @param { string } options['actionBtnText']  Action button text
 * @param { string } options['actionBtnLink']  Action button link
 * @param { string } options['footerText']  Text on the email footer
 * @returns html
 */
const generateMailTemplate = options => {
  const {
    receiverName,
    intro,
    text,
    actionBtnText = '',
    actionBtnLink = '',
    footerText = null
  } = options;
  return mailGenerator.generate({
    body: {
      name: receiverName,
      intro,
      action: {
        instructions: text,
        button: {
          color: '#33b5e5',
          text: actionBtnText,
          link: actionBtnLink
        }
      },
      ...(footerText && { outro: footerText })
    }
  });
};

/**
 *
 *
 * @param {object} msg Contains the email data
 * @param {string} msg['to'] - the recipient email address
 * @param {string} msg['from'] - the sender email address
 * @param {string} msg['subject'] - the email subject
 * @param {string} [msg['text']] - The text if only text is to be sent
 * @param {html} msg['html'] - the email html template
 * @returns
 */
const sendMail = async msg => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const sent = await sgMail.send(msg);
    console.log('===============sent===============', sent);
    return sent;
  } catch (error) {
    console.log('===============mail error============', error);
    return null;
  }
};

module.exports = {
  generateMailTemplate,
  sendMail
};
