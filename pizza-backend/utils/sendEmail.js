const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async ({ to, subject, text }) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_USER,
      name: 'Pizza App'
    },

    to: [
      {
        email: to
      }
    ],

    subject,

    textContent: text
  });

  console.log('Email sent successfully');
};

module.exports = sendEmail;