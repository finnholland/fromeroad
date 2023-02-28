require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
let aws = require("@aws-sdk/client-ses");

function sendEmail(userID, email, name) {
  const subdomain = process.env.NODE_ENV === 'prod' ? '' : 'dev.'

  const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: 'AKIAVTABPBBLB2V4QLGQ',
      secretAccessKey: '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'
    },
  });

  let transporter = nodemailer.createTransport({
    SES: { ses, aws },
    sendingRate: 1
  });

  const token = jwt.sign({
    userID: userID,
    name: name
  }, process.env.SECRET, { expiresIn: '10m' }
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

     https://192.168.1.100:9443/verify/${token}`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
    console.log(info);
  });
}

module.exports = sendEmail
