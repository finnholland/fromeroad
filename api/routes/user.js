require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const cors = require('cors')
const bcrypt = require("bcrypt")
const cryptojs = require("crypto-js")
const jwt = require('jsonwebtoken');
const salt = 10
const sendEmail = require('../helpers/sendEmail');
const sendResetCodeEmail = require('../helpers/sendResetCodeEmail');
app.use(cors());


// ROUTES RELATING TO USER ~~~~ api/user/{route}

// get user by ID
app.get('/profile', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const profileID = req.query.profileID
  db.query(`select name, email, trendPoints, company, project, phone, profileImageUrl from users where userID = ?`, [profileID], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})
app.get('/profile/interests/:profileID', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const profileID = req.params.profileID
  db.query(`SELECT interests.interestID, name FROM interests JOIN userinterests ON interests.interestID = userinterests.interestID WHERE userinterests.userID = ?`, [profileID], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// get user by email
app.get('/email', (req, res, next) => {
  const email = req.query.email
  db.query(`select email from users where email = ?`, [email], (err, result, fields) => {
    if (err) {
      next(err)
    } else if (result.length === 0) {
      return res.status(409).send({
        message: 'invalid email'
      });
    } else {
      return res.send(result);
    }
  })
})

app.post('/generateresetcode', (req, res, next) => {
  console.log(resetCode, email)
  db.query(`insert into resetcodes (code, email, createdAt) values (?, ?, now())`, [resetCode, email], (err, result, fields) => {
    if (err) {
      next(err)
    } else {
      sendResetCodeEmail(email, resetCode)
      return res.send(200);
    }
  })
})

app.get('/validateresetcode', (req, res, next) => {
  const email = req.query.email
  const resetCode = req.query.resetCode
  console.log(resetCode, email);
  db.query(`select * from resetcodes where email = ? and code = ? and createdAt > DATE_SUB(NOW(),INTERVAL 30 MINUTE)`, [email, resetCode], (err, result, fields) => {
    if (err) {
      next(err)
    } else if (result.length === 0) {
      return res.status(409).send({
        message: 'invalid code'
      });
    } else {
      return res.sendStatus(200);
    }
  })
})

app.post('/resetpassword', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400)
  }
  const email = req.body.email
  const password = cryptojs.AES.decrypt(req.body.password, process.env.CRYPTO_KEY);
  const decrypted = password.toString(cryptojs.enc.Utf8);

  bcrypt.hash(password, 10).then((hash) => {
    console.log(hash)
    db.query(`update users set password = ? where email = ?`, [hash, email], (err, result, fields) => { 
      if (err) next(err)
      else {
        return res.sendStatus(200)
      }
    })
  })
})

// get user from token
app.get('/autoLogin', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res, next) => {
  db.query('select * from users where userID = ?', [req.auth.userID], (err, result, fields) => {
    if (err) {
      next(err)
    } else {
      res.send(result)
    }
  })
})

// get user by password
app.post('/login', async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400)
  }
  const email = req.body.email;
  const password = cryptojs.AES.decrypt(req.body.password, process.env.CRYPTO_KEY);
  const decrypted = password.toString(cryptojs.enc.Utf8);
  db.query('select * from users where email = ?', email, (err, result, fields) => {
    if (err) {
      next(err)
    } else if (!result || result.length <= 0) {
      return res.status(401).send({
        message: 'invalid email or password'
      })
    } else {
      bcrypt.compare(decrypted, result[0].password, function (err, valid) {
        if (err) {
          return err
        }
        if (valid) {
          const encryptToken = jwt.sign({ userID: result[0].userID.toString() }, process.env.JWT_SECRET, { algorithm: 'HS256' });
          return res.status(200).send({
            message: "logged in successfully",
            user: result[0],
            token: encryptToken,
          })
        }
        else {
          return res.status(401).send({
            message: 'invalid email or password'
          })
        }
      })
    }
  })
})

// create user
app.post('/signup', async (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.company || !req.body.name) {
    return res.sendStatus(400)
  }
  const password = cryptojs.AES.decrypt(req.body.password, process.env.CRYPTO_KEY);
  const decrypted = password.toString(cryptojs.enc.Utf8);

  const user = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    password: decrypted,
  }

  let userID = 0

  db.query('select * from users where email = ?', user.email, (err, result) => { 
    if (err) {
      next(err)
    } else if (result.length != 0) {
      return res.status(409).send({
        message: 'this person exists :O'
      })
    }
    else {
      bcrypt.hash(user.password, 10).then((hash) => { 
        user.password = hash;
        db.query('insert into users (name, email, company, password) values (?,?,?,?)', [user.name, user.email, user.company, user.password], (err, result, fields) => {
          if (err) throw (err)
          userID = result.insertId
          db.query('SELECT * FROM users WHERE email = ?', user.email, (err,result) => {
            if (err) {
              return res.status(400).send({
                msg:err
              })
            }
            const encryptToken = jwt.sign({
              userID: userID.toString(),
              name: user.name
            }, process.env.JWT_SECRET, { algorithm: 'HS256' });
            sendEmail(userID, user.email, user.name)
            return res.status(201).send({
                user: user,
                msg: "successfully registered",
                token: encryptToken
              })
          })
        })
      })
    }
  })
})

app.post('/updateuser', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res, next) => { 
  if (req.auth.userID !== req.body.userID?.toString()) {
    return res.sendStatus(401)
  }
  const name = req.body.name
  const project = req.body.project
  const phone = req.body.phone
  const userID = req.body.userID
  db.query(`update users set name = ?, project = ?, phone = ? where userID = ?`, [name, project, phone, userID],
    (err, result, fields) => {
    if (err) {
      next(err)
    } else {
      res.send(result)
    }
  })
})

// add interest
app.post('/interests/addInterests/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res, next) => {
  if (!req.body.userID || !req.body.name) {
    return res.sendStatus(400)
  } else if (req.auth.userID !== req.body.userID.toString()) {
    return res.sendStatus(401)
  }
  const interestName = req.body.name;
  const userID = req.body.userID;
  let interestID = null;

  db.query('select interestID from interests where name = ?', [interestName], async (err, result, fields) => {
    if (err) {
      next(err)
    } else {
      interestID = result[0]?.interestID
    }

    if (!interestID || interestID === 0) {
      db.query('insert into interests (name) values (?)', interestName, (err, result, fields) => {
        if (err) next(err)
        interestID = result.insertId

        db.query('insert into userinterests (userID, interestID) values (?, ?)', [userID, interestID], (err, result, fields) => {
          if (err) next(err)
          else {
            return res.sendStatus(200)
          }
        })
      })
    } else {
      db.query('insert into userinterests (userID, interestID) values (?, ?)', [userID, interestID], (err, result, fields) => {
        if (err) return res.sendStatus(409)
        else {
          return res.sendStatus(200)
        }
      })
    }
    

  })  
})

// get interest
app.get('/interests/getInterests/:userID', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userID !== req.params.userID) {
    return res.sendStatus(401)
  }
  const userID = req.params.userID;
  
  db.query('SELECT * FROM interests JOIN userinterests ON interests.interestID = userinterests.interestID WHERE userinterests.userID = ?', userID, (err, result, fields) => {
    if (err) throw (err)
    else {
      return res.status(200).send(result)
    }
  })
})

// remove interest
app.delete('/interests/removeInterests', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  console.log(req.body.userID)
  if (!req.body.userID || !req.body.interestID) {
    return res.sendStatus(400)
  } else if (req.auth.userID !== req.body.userID.toString()) {
    return res.sendStatus(401)
  }
  const userID = req.body.userID;
  const interestID = req.body.interestID;
  
  db.query('delete from userinterests where userID = ? and interestID = ?', [userID, interestID], (err, result, fields) => {
    if (err) throw (err)
    else {
      return res.status(200).send(result)
    }
  })
})

// get interest
app.get('/interests/searchInterests/:searchQuery', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const searchQuery = req.params.searchQuery;
  
  db.query('SELECT * FROM interests WHERE name like ? order by LOCATE(?, name)', ['%'+searchQuery+'%', searchQuery], (err, result, fields) => {
    if (err) throw (err)
    else {
      return res.status(200).send(result)
    }
  })
})

module.exports = app;
