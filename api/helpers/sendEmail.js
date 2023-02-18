require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function sendEmail(userID, email, name) {
  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: 'finnholland@outlook.com',
      pass: 'RRz9a#kiMdts#W'
    }
  });

  const token = jwt.sign({
    userID: userID,
    name: name
  }, process.env.SECRET, { expiresIn: '10m' }
  );

  const mailConfigurations = {
    from: 'finnholland@outlook.com',
    to: email,
    subject: 'Fromeroad Email Verification',
    
    // This would be the text of email body
    text: `Hi ${name}, thanks for signing up to frome_road. You will need to verify your email before using the site.

    https://192.168.1.100:9443/verify/${token}`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
    console.log(info);
  });
}

module.exports = sendEmail
