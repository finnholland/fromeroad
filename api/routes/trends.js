require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query(`select tt.*, u.company, u.profileImageUrl from topten as tt inner join users as u on u.userID = tt.userID limit 5;`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;