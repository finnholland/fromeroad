require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query(`select tt.*, u.name, u.company, u.profileImageUrl, IFNULL(postCount, 0) as postCount from topten as tt 
              inner join users as u on u.userId = tt.userId
              left join (
                select userId, COUNT(posts.userId) as postCount from posts
                  where TIMESTAMPDIFF(day, posts.createdAt, NOW()) < 7  group by userId
              ) recentPosts
              on u.userId = recentPosts.userId
              where tt.trendPoints > 0
              limit 10`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

app.get('/updateTopTen', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query(`UPDATE users SET trendPoints = FLOOR(RAND()*10000) where userId >= 0; call sp_updatetopten;`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;