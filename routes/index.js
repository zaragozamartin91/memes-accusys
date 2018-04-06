var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Memes accusyanos' });
});

router.post('/salute', (req, res) => {
  console.log(req.body);
  res.send({ msg: 'ok' });
});

module.exports = router;
