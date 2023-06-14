require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const fs = require('fs')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
})

const storage = multerS3({
  s3: s3,
  bucket: `fromeroad-${process.env.ENV}`,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    console.log(file)
    cb(null, `data/user/${req.params.userId}/images/profile/${file.originalname.replace(' ', '_')}`)
  },
})

const upload = multer({
  storage: storage
})

app.post('/profileImage/:userId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), upload.single('file'), (req, res) => {
  if (req.auth.userId !== req.body.userId || req.body.userId !== req.params.userId) {
    return res.sendStatus(401)
  }
  if (!req.file) {
    console.log("No file upload");
    res.sendStatus(403)
  } else {
    const imgsrc = `/data/user/${req.params.userId}/images/profile/${req.file.originalname.replace(' ', '_')}`
    console.log(imgsrc)
    db.query('update users set profileImageUrl = ? where userId = ?', [imgsrc, req.body.userId], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

app.get('/profileImage/:userId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.params.userId) {
    return res.sendStatus(401)
  }
  db.query('select profileImageUrl from users where userId = ?', req.params.userId, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app