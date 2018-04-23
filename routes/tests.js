var express = require('express');
var router = express.Router();

const User = require('../model/user');
const Meme = require('../model/meme');

router.post('/salute', (req, res) => {
  console.log(req.body);
  res.send({ msg: 'ok' });
});

// Access the session as req.session
router.get('/session', function (req, res, next) {
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

router.post('/data', (req, res) => {
  User.createTable().then(e => {
    console.log('Tabla de usuarios creada');
    return Meme.createTable();
  }).then(e => {
    console.log('Tabla de memes creada');
    const userobj = { username: 'franco', name: 'Franco milanese', avatarimg: 'franco_avatar.png', password: 'facho', description: 'Enano culo roto' };
    return User.insert(userobj);
  }).then(usr => {
    console.log(`Usuario ${JSON.stringify(usr)} insertado!`);
    return true;
  }).then(b => {
    console.log('Creacion de datos ok');
    res.send({ msg: 'OK' });
  }).catch(cause => {
    console.error(cause);
    res.send({ msg: 'FAIL' });
  });
});

module.exports = router;