require('dotenv').config();

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./images/${req.params.userID}/`
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

app.post('/profileImage/:userID', upload.single('file'), (req, res) => {
  console.log(req.params.userID)
  if (!req.file) {
    console.log("No file upload");
    res.sendStatus(403)
  } else {
    const imgsrc = `/images/${req.body.userID}/${req.file.filename.replace(' ', '_')}`
    db.query('update users set profileImageUrl = ? where userID = ?', [imgsrc, req.body.userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

app.get('/profileImage/:userID', (req, res) => {
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