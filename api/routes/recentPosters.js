var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
app.use(cors());

app.get('/', (req, res) => {
  db.query('select * from users', (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;
