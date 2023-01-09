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
  const initialUpvoteValue = 0;
  console.log(req.body)
  if (!req.file) {
    db.query('insert into posts (body, createdAt, userID) values (?, now(), ?)', [body, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        db.query('insert into postvotes (postID, userID, vote) values (?, ?, ?)', [result.insertId, userID, initialUpvoteValue], (err, result, fields) => {
          if (err) return err.code
          res.send(result)
        })
      }
    })
  } else {
    const imgsrc = `/images/post/${req.body.postID}/${req.file.filename.replace(' ', '_')}`
    db.query('insert into posts (body, postImageUrl, createdAt, userID) values (?, ?, now(), ?)', [body, imgsrc, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
          db.query('insert into postvotes (postID, userID, vote) values (?, ?, ?)', [result.insertId, userID, initialUpvoteValue], (err, result, fields) => {
            if (err) return err.code
            res.send(result)
        })
      }
    })
  }
});

app.get('/get', (req, res) => {
  const userID = req.query.userID
  db.query(`SELECT posts.*, name, company, profileImageUrl, IFNULL(vote, 0) as vote FROM posts
            inner join users on posts.userID = users.userID
            LEFT JOIN postvotes ON postvotes.postID = posts.postID AND postvotes.userID = ?
            where TIMESTAMPDIFF(day, createdAt, NOW()) < 7
            GROUP BY postID
            order by createdAt desc;`, userID,
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/upvote/:postID/', (req, res) => {
  const postID = req.params.postID;
  const posterID = req.body.posterID;
  const upvoteValue = 1 
  db.query(`update users set trendpoints = trendpoints - (SELECT IFNULL(SUM(vote), 0) as vote FROM postvotes WHERE postID = ?) where userID = ?;
            INSERT INTO postvotes (postID, userID, vote) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE vote = not vote;
            update posts set trendpoints = (SELECT SUM(vote) FROM postvotes WHERE postID = ?) where postID = ?;
            update users set trendpoints = trendpoints + (SELECT IFNULL(SUM(vote), 0) as vote FROM postvotes WHERE postID = ?) where userID = ?;`, [postID, posterID, postID, req.body.userID, upvoteValue, postID, postID, postID, posterID], (err, result, fields) => {
    if (err) return err.code
    else {
      return res.status(200).send({
        votes: result,
      })
    } 
  })
})

module.exports = app