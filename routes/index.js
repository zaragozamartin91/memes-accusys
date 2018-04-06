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

// Access the session as req.session
router.get('/test/session', function (req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})

router.post('/test/salute', (req, res) => {
  console.log(req.body);
  res.send({ msg: 'ok' });
});

module.exports = router;
