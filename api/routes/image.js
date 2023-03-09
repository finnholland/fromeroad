require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const fs = require('fs')

const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  },
});

const storage = multerS3({
  s3: s3,
  bucket: 'fromeroad-' + process.env.ENV,
  acl: 'public-read',
  // contentType: 'image/png',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, `user/${req.params.userID}/profile/${file.originalname.replace(' ', '_')}`)
  }
})

const upload = multer({
  storage: storage
})

app.post('/profileImage/:userID', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), upload.single('file'), (req, res) => {
  if (req.auth.userID !== req.body.userID || req.body.userID !== req.params.userID) {
    return res.sendStatus(401)
  }
  if (!req.file) {
    console.log("No file upload");
    res.sendStatus(403)
  } else {
    const imgsrc = req.file.location.replace(/^.*?com/, '')
    db.query('update users set profileImageUrl = ? where userID = ?', [imgsrc, req.body.userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

app.get('/profileImage/:userID', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.params.userID) {
    return res.sendStatus(401)
  }
  db.query('select profileImageUrl from users where userID = ?', req.params.userID, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app