require('dotenv').config();

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

app.post('/', upload.single('file'), (req, res) => {
  console.log(req.body)
  if (!req.file) {
    console.log("No file upload");
    res.sendStatus(403)
  } else {
    const imgsrc = `/images/${req.body.userID}/${req.file.filename}`
    db.query('update users set profileImageUrl = ? where userID = ?', [imgsrc, req.body.userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

module.exports = app