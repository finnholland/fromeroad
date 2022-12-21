var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/:id', (req, res) => {
  db.query(`select * from users where userID = ${req.params.id}`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;
