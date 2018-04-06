var express = require('express');
var router = express.Router();

const User = require('../model/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  const { username = '', password } = req.body;
  console.log('Credenciales: ' + JSON.stringify(req.body));

  User.findByUsername(username).then(([user]) => {
    if (user && User.validate(user, password)) {
      req.session.uid = user.id;
    } else {
      console.log('USUARIO INVALIDO');
      res.message('Usuario invalido', 'error');
    }

    res.redirect('/index');
  });
});

module.exports = router;
