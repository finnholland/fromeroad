require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query(`select tt.*, u.name, u.company, u.profileImageUrl, IFNULL(postCount, 0) as postCount from topten as tt 
              inner join users as u on u.userID = tt.userID
              left join (
                select userID, COUNT(posts.userID) as postCount from posts
                  where TIMESTAMPDIFF(day, posts.createdAt, NOW()) < 7  group by userID
              ) recentPosts
              on u.userID = recentPosts.userID
              where tt.trendPoints > 0
              limit 10`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;