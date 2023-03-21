require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");
var express = require('express');

app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query(`select users.userID, name, company, profileImageUrl, postCount, lastPost from users
            left join (select userID, COUNT(posts.userID) as postCount, max(createdAt) as lastPost from posts where TIMESTAMPDIFF(day, posts.createdAt, NOW()) < 7  group by userID) recentPosts
            on users.userID = recentPosts.userID
            where users.userID in (select userID from posts) and postCount is not null
            order by postCount desc limit 5;`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;
