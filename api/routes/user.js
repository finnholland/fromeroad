require('dotenv').config();
const { expressjwt: ejwt } = require("express-jwt");

var express = require('express');
app = express()
var db = require('..');
const argon2 = require("argon2")
const cryptojs = require("crypto-js")
const jwt = require('jsonwebtoken');
const salt = 10
const sendEmail = require('../helpers/sendEmail');
const sendResetCodeEmail = require('../helpers/sendResetCodeEmail');


// ROUTES RELATING TO USER ~~~~ api/user/{route}

// get user by Id
app.get('/profile', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const profileId = req.query.profileId
  db.query(`select name, email, trendPoints, company, project, phone, profileImageUrl from users where userId = ?`, [profileId], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})
app.get('/profile/interests/:profileId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  const profileId = req.params.profileId
  db.query(`SELECT interests.interestId, name FROM interests JOIN userinterests ON interests.interestId = userinterests.interestId WHERE userinterests.userId = ?`, [profileId], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// get user by email
app.get('/email', (req, res) => {
  const email = req.query.email
  db.query(`select email from users where email = ?`, [email], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else if (result.length === 0) {
      return res.status(409).send({
        message: 'invalid email'
      });
    } else {
      return res.send(result);
    }
  })
})

app.post('/generateresetcode', (req, res) => {
  const email = req.body.email
  const resetCode = Math.floor(100000 + Math.random() * 900000);
  db.query(`insert into resetcodes (code, email, createdAt) values (?, ?, now())`, [resetCode, email], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      sendResetCodeEmail(email, resetCode)
      return res.sendStatus(200);
    }
  })
})

app.get('/validateresetcode', (req, res) => {
  const email = req.query.email
  const resetCode = req.query.resetCode
  console.log(resetCode, email);
  db.query(`select * from resetcodes where email = ? and code = ? and createdAt > DATE_SUB(NOW(),INTERVAL 30 MINUTE)`, [email, resetCode], (err, result, fields) => {
    console.log(result)
    if (err) {
      console.log('error occurred: '+ err)
    } else if (result.length === 0) {
      return res.status(409).send({
        message: 'invalid code'
      });
    } else {
      return res.send(200);
    }
  })
})

app.post('/resetpassword', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.sendStatus(400)
  }
  argon2.hash(password).then((hash) => {
    db.query(`update users set password = ? where email = ?`, [hash, email], (err, result, fields) => { 
      if (err) throw (err)
      else {
        return res.sendStatus(200)
      }
    })
  })
})

// get user from token
app.get('/autoLogin', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  db.query('select * from users where userId = ?', [req.auth.userId], (err, result, fields) => {
    if (err) {
      console.log('error occurred: '+ err)
    } else {
      res.send(result)
    }
  })
})

// get user by password
app.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = cryptojs.AES.decrypt(req.body.password, process.env.CRYPTO_KEY);
  const decrypted = password.toString(cryptojs.enc.Utf8);
  db.query('select * from users where email = ?', email, (err, result, fields) => {
    if (err) {
      next(err)
    } else if (result.length <= 0) {
      res.status(401).send({
        message: 'invalid email or password'
      })
    } else {
      argon2.verify(result[0].password, decrypted).then((success) => {
        const encryptToken = jwt.sign({ userId: result[0].userId.toString() }, process.env.JWT_SECRET, { algorithm: 'HS256' });
        return res.status(200).send({
          message: "logged in successfully",
          user: result[0],
          token: encryptToken,
        })
      }).catch(err => {
        return res.status(401).send({
          message: 'invalid email or password'
        })
      })
    }
  })
})

// create user
app.post('/signup', async (req, res, next) => {
  const password = cryptojs.AES.decrypt(req.body.password, process.env.CRYPTO_KEY);
  const decrypted = password.toString(cryptojs.enc.Utf8);

  const user = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    password: decrypted,
  }

  let userId = 0

  db.query('select * from users where email = ?', user.email, (err, result) => { 
    if (err) throw (err)
    if (result.length != 0) {
      return res.status(409).send({
        message: 'this person exists :O'
      })
    }
    else {
      argon2.hash(user.password).then((hash) => { 
        user.password = hash;
        db.query('insert into users (name, email, company, password) values (?,?,?,?)', [user.name, user.email, user.company, user.password], (err, result, fields) => {
          if (err) throw (err)
          userId = result.insertId
          db.query('SELECT * FROM users WHERE email = ?', user.email, (err,result) => {
            if (err) {
              return res.status(400).send({
                msg:err
              })
            }
            const encryptToken = jwt.sign({
              userId: userId.toString(),
              name: user.name
            }, process.env.JWT_SECRET, { algorithm: 'HS256' });
            sendEmail(userId, user.email, user.name)
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
  if (req.auth.userId !== req.body.userId?.toString()) {
    return res.sendStatus(401)
  }
  const name = req.body.name
  const project = req.body.project
  const phone = req.body.phone
  const userId = req.body.userId
  db.query(`update users set name = ?, project = ?, phone = ? where userId = ?`, [name, project, phone, userId],
    (err, result, fields) => {
    if (err) {
      console.log('error occurred: ' + err)
      return err.code
    } else {
      res.send(result)
    }
  })
})

// add interest
app.post('/interests/addInterests/', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res, next) => {
  if (!req.body.userId || !req.body.name) {
    return res.sendStatus(400)
  } else if (req.auth.userId !== req.body.userId.toString()) {
    return res.sendStatus(401)
  }
  const interestName = req.body.name;
  const userId = req.body.userId;
  let interestId = null;

  db.query('select interestId from interests where name = ?', [interestName], async (err, result, fields) => {
    if (err) {
      next(err)
    } else {
      interestId = result[0]?.interestId
    }

    if (!interestId || interestId === 0) {
      db.query('insert into interests (name) values (?)', interestName, (err, result, fields) => {
        if (err) next(err)
        interestId = result.insertId

        db.query('insert into userinterests (userId, interestId) values (?, ?)', [userId, interestId], (err, result, fields) => {
          if (err) next(err)
          else {
            return res.sendStatus(200)
          }
        })
      })
    } else {
      db.query('insert into userinterests (userId, interestId) values (?, ?)', [userId, interestId], (err, result, fields) => {
        if (err) return res.sendStatus(409)
        else {
          return res.sendStatus(200)
        }
      })
    }
    

  })  
})

// get interest
app.get('/interests/getInterests/:userId', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  if (req.auth.userId !== req.params.userId) {
    return res.sendStatus(401)
  }
  const userId = req.params.userId;
  
  db.query('SELECT * FROM interests JOIN userinterests ON interests.interestId = userinterests.interestId WHERE userinterests.userId = ?', userId, (err, result, fields) => {
    if (err) throw (err)
    else {
      return res.status(200).send(result)
    }
  })
})

// remove interest
app.delete('/interests/removeInterests', ejwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
  console.log(req.body.userId)
  if (!req.body.userId || !req.body.interestId) {
    return res.sendStatus(400)
  } else if (req.auth.userId !== req.body.userId.toString()) {
    return res.sendStatus(401)
  }
  const userId = req.body.userId;
  const interestId = req.body.interestId;
  
  db.query('delete from userinterests where userId = ? and interestId = ?', [userId, interestId], (err, result, fields) => {
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
