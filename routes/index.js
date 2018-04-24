var express = require('express');
var router = express.Router();

var loginMiddleware = require('../middleware/login');

const Meme = require('../model/meme');

/* GET home page. */
router.get('/', loginMiddleware, function (req, res, next) {
  Meme.find().then(memes => {
    res.render('index', { title: 'Memes accusyanos', memes });
  });
});

router.get('/index', (req, res) => {
  res.redirect('/');
});


module.exports = router;
