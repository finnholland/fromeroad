require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./data/user/${req.params.userID}/images/profile`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, file.originalname.replace(' ', '_'))
  }
})

const upload = multer({
  storage: storage
})

app.post('/profileImage/:userID', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), upload.single('file'), (req, res) => {
  console.log(req.params.userID)
  if (!req.file) {
    console.log("No file upload");
    res.sendStatus(403)
  } else {
    const imgsrc = `/data/user/${req.params.userID}/images/profile/${req.file.filename.replace(' ', '_')}`
    db.query('update users set profileImageUrl = ? where userID = ?', [imgsrc, req.body.userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

app.get('/profileImage/:userID', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  console.log(req.body)
  db.query('select profileImageUrl from users where userID = ?', req.params.userID, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app