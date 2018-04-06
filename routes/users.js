var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  const { username = '', password } = req.body;
  console.log('Credenciales: ' + JSON.stringify(req.body));
  req.session.uid = username;
  res.redirect('/index');
});

module.exports = router;
