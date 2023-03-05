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
    const path = `./data/user/${req.params.userID}/images/posts/`
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

app.post('/create/:userID', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), upload.single('file'), (req, res) => {
  if (req.auth.userID !== req.body.userID.toString()) {
    return res.sendStatus(401)
  }
  const userID = req.body.userID;
  const body = req.body.body;
  const initialUpvoteValue = 0;
  if (!req.file) {
    db.query('insert into posts (body, createdAt, userID) values (?, now(), ?)', [body, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: ' + err)
      } else {
        db.query('insert into postvotes (postID, userID, vote) values (?, ?, ?)', [result.insertId, userID, initialUpvoteValue], (err, result, fields) => {
          if (err) return err.code
          res.sendStatus(201)
        })
      }
    })
  } else {
    const imgsrc = `/data/user/${req.params.userID}/images/posts/${req.file.filename.replace(' ', '_')}`
    db.query('insert into posts (body, postImageUrl, createdAt, userID) values (?, ?, now(), ?)', [body, imgsrc, userID], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        db.query('insert into postvotes (postID, userID, vote) values (?, ?, ?)', [result.insertId, userID, initialUpvoteValue], (err, result, fields) => {
          if (err) return err.code
          res.sendStatus(201)
        })
      }
    })
  }
});

app.get('/get', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.query.userID.toString()) {
    return res.sendStatus(401)
  }
  const userID = req.query.userID
  const sign = req.query.sign
  const condition = req.query.condition
  db.query(`SELECT posts.*, UNIX_TIMESTAMP(createdAt) AS createdAtUnix, name, company, profileImageUrl, IFNULL(vote, 0) as vote FROM posts
            inner join users on posts.userID = users.userID
            LEFT JOIN postvotes ON postvotes.postID = posts.postID AND postvotes.userID = ?
            where TIMESTAMPDIFF(day, createdAt, NOW()) < 7 and posts.postID ${sign} ?
            GROUP BY postID
            order by createdAt desc
            limit 10;`, [userID, condition],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.get('/comments/get/:postID', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  const postID = req.params.postID
  db.query(`select pc.*, name, company, profileImageUrl, UNIX_TIMESTAMP(pc.createdAt) AS createdAt from postcomments as pc 
            left join users as u on u.userID = pc.userID where postID = ?
            order by pc.createdAt asc`, [postID],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.delete('/comments/delete/:userID/:commentID', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.params.userID) {
    return res.sendStatus(401)
  }
  const commentID = req.params.commentID
  db.query(`delete from postcomments where commentID = ?`, [commentID],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/comments/post/', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.body.userID.toString()) {
    return res.sendStatus(401)
  }
  const postID = req.body.postID
  const userID = req.body.userID
  const body = req.body.body
  db.query(`insert into postcomments (postID, userID, body) values (?, ?, ?)`, [postID, userID, body],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/comments/update/', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.body.userID.toString()) {
    return res.sendStatus(401)
  }
  const postID = req.body.postID
  const userID = req.body.userID
  const commentID = req.body.commentID
  const body = req.body.body
  db.query(`update postcomments set body = ? where commentID = ? and postID = ? and userID = ?`, [body, commentID, postID, userID],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/upvote/:postID/', ejwt({ secret: process.env.SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.body.userID.toString() || req.body.userID === req.body.posterID) {
    return res.sendStatus(401)
  }
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