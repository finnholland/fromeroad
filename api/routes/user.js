require('dotenv').config();

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const salt = 10
app.use(cors());


// ROUTES RELATING TO USER ~~~~ api/user/{route}

// get user by ID
app.get('/userID/:id', (req, res) => {
  let token = req.headers['authorisation']
  token = token && token.split(' ')[1]
  const decryptToken = jwt.verify(token, process.env.SECRET, { algorithms: ["HS256"] });
  console.log("\nJWT verification result: " + JSON.stringify(decryptToken));
  db.query('select * from users where userID = ?', [req.params.id], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// get user from token
app.get('/autoLogin', (req, res) => {
  let token = req.headers['authorisation']
  token = token && token.split(' ')[1]
  const decryptToken = jwt.verify(token, process.env.SECRET, { algorithms: ["HS256"] });
  db.query('select * from users where userID = ?', [decryptToken.userID], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// get user by password
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query('select * from users where email = ?', email, (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      res.sendStatus(err.code)
    } else if (result.length <= 0) {
      res.status(401).send({
          msg:'email or password is incorrect'
      })
    } else {
      bcrypt.compare(password, result[0].password, function (err, valid) {
        if (err) {
          return err
        }
        if (valid) {
          const encryptToken = jwt.sign({ userID: result[0].userID.toString() }, process.env.SECRET, { algorithm: 'HS256' });
          return res.status(200).send({
              msg: "logged in successfully",
              user: result[0],
              token: encryptToken,
          })
        }
        else {
          return res.status(401)
        }
      })
    }
  })
})

// create user
app.post('/signup', async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    password: req.body.password,
  }

  db.query('select * from users where email = ?', user.email, (err, result) => { 
    if (err) throw (err)
    if (result.length != 0) {
      res.sendStatus(409)
    }
    else {
      bcrypt.hash(user.password, 10).then((hash) => { 
        user.password = hash;
        db.query('insert into users (name, email, company, password) values (?,?,?,?)', [user.name, user.email, user.company, user.password], (err, result, fields) => {
          if (err) throw (err)
        })
      
        db.query('SELECT * FROM users WHERE email = ?', user.email, (err,result) => {
          if (err) {
            return res.status(400).send({
                msg:err
            })
          }
          return res.status(201).send({
              user: user,
              msg:"successfully registered"
            })
        })
      })
    }
  })
})

// add interest
app.post('/interests/addInterests/', (req, res) => {
  const interestName = req.body.name;
  const userID = req.body.userID;
  console.log(interestName, userID)
  let interestID = 0;

  db.query('select interestID from interests where name = ?', [interestName], async (err, result, fields) => {
    if (err) throw (err)
    else {
      interestID = result[0]?.interestID
      console.log(result[0]?.interestID)
    }

    if (!interestID || interestID === 0) {
      db.promise.query('insert into interests (name) values (?); select LAST_INSERT_ID();', [interestName], (err, result, fields) => {
        if (err) throw (err)
        console.log(result[0]?.insertID)
        interestID = result[0]?.insertID
      })
    } 
    db.query('insert into userinterests (userID, interestID) values (?, ?)', [userID, interestID], (err, result, fields) => {
      if (err) throw (err)
      else {
        return res.sendStatus(200)
      }
    })
  })  
})

// get interest
app.get('/interests/getInterests', (req, res) => {
  const userID = req.body.userID;
  console.log(userID)
})

module.exports = app;
