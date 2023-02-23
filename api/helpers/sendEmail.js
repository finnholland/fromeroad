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
    html: `<html style="justify-content: center; display: flex; flex-direction: column; align-items: center;">
            <body style="width: fit-content;">
                <div>
                    <h3>Hi ${name},</h3>
                    <p>Thanks for signing up to frome_road</p>
                    <p>You will need to verify your email before using the site.</p>
                </div>

                <a href="https://api.fromeroad.com/verify/${token}">
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
