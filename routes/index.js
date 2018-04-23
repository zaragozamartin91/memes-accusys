var express = require('express');
var router = express.Router();

var loginMiddleware = require('../middleware/login');

/* GET home page. */
router.get('/', loginMiddleware, function (req, res, next) {
  res.render('index', { title: 'Memes accusyanos' });
});

router.get('/index', (req, res) => {
  res.redirect('/');
});


module.exports = router;
