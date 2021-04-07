const nodemailer = require('nodemailer');

require('dotenv/config');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PWD
  }
});

const sendConfirmationEmail = async (name, email, confirmationCode) => {
  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please confirm your account',
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for creating an account. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.FRONTEND_URL}/confirm/${confirmationCode}> Click here</a>
        </div>`
  });
};

module.exports = { sendConfirmationEmail };
