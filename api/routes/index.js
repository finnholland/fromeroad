var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fromeroad API', body: 'Fromeroad' },);
});

module.exports = router;
