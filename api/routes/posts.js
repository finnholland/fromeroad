require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const multer = require('multer');
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const fs = require('fs')

const s3 = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
})

const storage = multerS3({
  s3: s3,
  bucket: `fromeroad-${process.env.ENV === "local" ? "dev" : process.env.ENV}`,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    console.log(file)
    cb(null, `data/user/${req.params.userId}/images/posts/${file.originalname.replace(' ', '_')}`)
  },
})

const upload = multer({
  storage: storage
})

app.post('/create/:userId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), upload.single('file'), (req, res) => {
  if (req.auth.userId !== req.body.userId.toString()) {
    return res.sendStatus(401)
  }
  const userId = req.body.userId;
  const body = req.body.body;
  const initialUpvoteValue = 0;
  if (!req.file) {
    db.query('insert into posts (body, createdAt, userId) values (?, now(), ?)', [body, userId], (err, result, fields) => {
      if (err) {
        console.log('error occurred: ' + err)
      } else {
        db.query('insert into postvotes (postId, userId, vote) values (?, ?, ?)', [result.insertId, userId, initialUpvoteValue], (err, result, fields) => {
          if (err) return err.code
          res.sendStatus(201)
        })
      }
    })
  } else {
    const imgsrc = `/data/user/${req.params.userId}/images/posts/${req.file.originalname.replace(' ', '_')}`
    db.query('insert into posts (body, postImageUrl, createdAt, userId) values (?, ?, now(), ?)', [body, imgsrc, userId], (err, result, fields) => {
      if (err) {
        console.log('error occurred: '+ err)
      } else {
        db.query('insert into postvotes (postId, userId, vote) values (?, ?, ?)', [result.insertId, userId, initialUpvoteValue], (err, result, fields) => {
          if (err) return err.code
          res.sendStatus(201)
        })
      }
    })
  }
});

app.get('/get', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.query.userId.toString()) {
    return res.sendStatus(401)
  }
  const userId = req.query.userId
  const sign = req.query.sign
  const condition = req.query.condition
  db.query(`SELECT posts.*, UNIX_TIMESTAMP(createdAt) AS createdAtUnix, name, company, profileImageUrl, IFNULL(vote, 0) as vote FROM posts
            inner join users on posts.userId = users.userId
            LEFT JOIN postvotes ON postvotes.postId = posts.postId AND postvotes.userId = ?
            where TIMESTAMPDIFF(day, createdAt, NOW()) < 7 and posts.postId ${sign} ? and visible = 1
            GROUP BY postId
            order by createdAt desc
            limit 10;`, [userId, condition],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.get('/comments/get/:postId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const postId = req.params.postId
  db.query(`select pc.*, name, company, profileImageUrl, UNIX_TIMESTAMP(pc.createdAt) AS createdAt from comments as pc 
            left join users as u on u.userId = pc.userId where postId = ?
            order by pc.createdAt desc`, [postId],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.delete('/comments/delete/:userId/:commentId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.params.userId) {
    return res.sendStatus(401)
  }
  const commentId = req.params.commentId
  db.query(`delete from comments where commentId = ?`, [commentId],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/comments/post/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.body.userId.toString()) {
    return res.sendStatus(401)
  }
  const postId = req.body.postId
  const userId = req.body.userId
  const body = req.body.body
  db.query(`insert into comments (postId, userId, body) values (?, ?, ?)`, [postId, userId, body],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/comments/update/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.body.userId.toString()) {
    return res.sendStatus(401)
  }
  const postId = req.body.postId
  const userId = req.body.userId
  const commentId = req.body.commentId
  const body = req.body.body
  db.query(`update comments set body = ? where commentId = ? and postId = ? and userId = ?`, [body, commentId, postId, userId],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

app.post('/upvote/:postId/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.body.userId.toString() || req.body.userId === req.body.posterId) {
    return res.sendStatus(401)
  }
  const postId = req.params.postId;
  const posterId = req.body.posterId;
  const upvoteValue = 1 
  db.query(`update users set trendpoints = trendpoints - (SELECT IFNULL(SUM(vote), 0) as vote FROM postvotes WHERE postId = ?) where userId = ?;
            INSERT INTO postvotes (postId, userId, vote) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE vote = not vote;
            update posts set trendpoints = (SELECT SUM(vote) FROM postvotes WHERE postId = ?) where postId = ?;
            update users set trendpoints = trendpoints + (SELECT IFNULL(SUM(vote), 0) as vote FROM postvotes WHERE postId = ?) where userId = ?;`, [postId, posterId, postId, req.body.userId, upvoteValue, postId, postId, postId, posterId], (err, result, fields) => {
    if (err) return err.code
    else {
      return res.status(200).send({
        votes: result,
      })
    } 
  })
})

module.exports = app