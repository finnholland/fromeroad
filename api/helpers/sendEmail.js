require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
let aws = require("@aws-sdk/client-ses");

function sendEmail(userID, email, name) {
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

  const token = jwt.sign({
      userID: userID,
      name: name
    }, process.env.JWT_SECRET, { expiresIn: '10m' }
  );

  const mailConfigurations = {
    from: 'no-reply-fromeroad@fromeroad.com',
    to: email,
    subject: 'Fromeroad Email Verification',
    
    // This would be the text of email body
    html: `<html style="justify-content: center; display: flex; flex-direction: column; align-items: center;">
            <body style="width: fit-content;">
                <div>
                    <h3>Hi ${name},</h3>
                    <p>Thanks for signing up to frome_road</p>
                    <p>You will need to verify your email before using the site.</p>
                </div>

                <a href="https://${subdomain}api.fromeroad.com/verify/${token}">
                    <button style="background-color: #5900B2; border: 0; color: white; 
                    font-size: large;  width: 100%;
                    padding-left: 15px; padding-right: 15px; padding-top: 5px; padding-bottom: 5px; border-radius: 5px;">verify</button>
                </a>
            </body>
          </html>`,
     text: `Hi ${name}, thanks for signing up to frome_road. You will need to verify your email before using the site.

     https://${subdomain}api.fromeroad.com/verify/${token}`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) return { message: error, code: 500 };
    console.log('Email Sent Successfully');
    console.log(info);
  });
  return { message: 'success!', code: 200 }
}

module.exports = sendEmail
