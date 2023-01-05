var express = require('express');
app = express()
var db = require('..');
const cors = require('cors');
app.use(cors());
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./images/post/${req.params.postID}/`
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

app.post('/create', upload.single('file'), (req, res) => {
  const userID = req.body.userID;
  const body = req.body.body;
  console.log(req.body)
  if (!req.file) {
    db.query('insert into posts (body, createdAt, userID) values (?, now(), ?)', [body, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  } else {
    const imgsrc = `/images/post/${req.body.postID}/${req.file.filename.replace(' ', '_')}`
    db.query('insert into posts (body, postImageUrl, createdAt, userID) values (?, ?, now(), ?)', [body, imgsrc, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        res.send(result)
      }
    })
  }
});

app.get('/get', (req, res) => {
  db.query(`select posts.*, name, company, profileImageUrl from posts
            inner join users on posts.userID = users.userID
            where TIMESTAMPDIFF(day, createdAt, NOW()) < 7
            order by createdAt desc;`,
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app