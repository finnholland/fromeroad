require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
let aws = require("@aws-sdk/client-ses");

function sendResetCodeEmail(email, resetCode) {
  const subdomain = process.env.ENV === 'prod' ? '' : 'dev.'

  const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.SES_KEY,
      secretAccessKey: process.env.SES_SECRET
    },
  });

  let transporter = nodemailer.createTransport({
    SES: { ses, aws },
    sendingRate: 1
  });

  const mailConfigurations = {
    from: 'no-reply-fromeroad@fromeroad.com',
    to: email,
    subject: 'frome_road Password reset',
    
    // This would be the text of email body
    html: `<html style="justify-content: center; display: flex; flex-direction: column; align-items: center;">
            <body style="width: fit-content;">
                <div>
                  <p>You have requested a change of password.</p>
                  <p>Here is your validation code</p>
                </div>
                <p>${resetCode}</p>
                <p>This code will expire in 30 minutes</p>
                <p>If this was not you, please contact support!</p>
            </body>
          </html>`,
     text: `You requested a change of password, please use this code ${resetCode} to update your password on frome_road. https://www.fromeroad.com

     If this was not you, please contact support.`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) return { message: error, code: 500 };
    console.log('Email Sent Successfully');
    console.log(info);
  });
  return { message: 'success!', code: 200 }
}

module.exports = sendResetCodeEmail
