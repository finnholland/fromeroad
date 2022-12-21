var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
const bcrypt = require("bcrypt") 
app.use(cors());

// get user by ID
app.get('/:id', (req, res) => {
  db.query(`select * from users where userID = ${req.params.id}`, (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// create user
app.post("/createUser", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const company = req.body.company;
  const password = await bcrypt.hash(req.body.password);
  console.log(password)
  db.query('insert into users (name, email, company, password) values (?,?,?,?)', [name, email, company, password], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

module.exports = app;
