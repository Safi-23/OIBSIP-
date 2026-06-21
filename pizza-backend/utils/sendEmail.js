const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection successful');

    const info = await transporter.sendMail({
      from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('Email sent:', info.messageId);

    return info;
  } catch (error) {
    console.error('EMAIL ERROR:', error);
    throw error;
  }
};

module.exports = sendEmail;