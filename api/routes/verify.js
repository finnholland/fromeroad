require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");
const jwt = require('jsonwebtoken');
var db = require('..');
var express = require('express');
const sendEmail = require('../helpers/sendEmail');

app = express()

app.get('/:token', (req, res) => {
  const token = req.params.token;

  // Verifying the JWT token 
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("Email verification failed, possibly the link is invalid or expired");
      }
      else {
        // get userid
        db.query('update users set verified = 1 where userId = ?', [decoded.userId], (err, result, fields) => {
          if (err) {
            console.log('error occurred: '+ err)
          } else {
            res.send(`Hi ${decoded.name}, your email has been verified successfully`);
          }
        })
        
      }
  });
})

app.put('/reverify', (req, res) => {
  const userId = req.body.userId
  const name = req.body.name
  const email = req.body.email
  const statusCode = sendEmail(userId, email, name)
  return res.send(statusCode)
})

module.exports = app

