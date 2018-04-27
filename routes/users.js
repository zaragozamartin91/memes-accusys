var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

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

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/index');
});

router.get('/signup', (req, res) => {
  res.render('user_signup', { title: 'Memes accusyanos' });
});

router.post('/signup', (req, res, next) => {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    const username = fields.username;
    const name = fields.name;
    const password = fields.password;
    const repPassword = fields.reppassword;

    if (!username || !password || !repPassword || !name) {
      res.message('Campos incompletos', 'error');
      return res.redirect('back');
    }

    if (password != repPassword) {
      res.message('Las claves no coinciden', 'error');
      return res.redirect('back');
    }

    const imgfile = files.imgfile;
    if (!imgfile) {
      res.message('No se envio una imagen de avatar', 'error');
      return res.redirect('back');
    }

    const img = `${Date.now()}_${imgfile.name}`;
    const destPath = path.join(process.env.IMG_DIR, img);
    fs.createReadStream(imgfile.path).pipe(fs.createWriteStream(destPath));

    //username, name, avatarimg, password
    User.insert({ username, name, avatarimg: img, password }).then(usr => {
      console.log(`Usuario ${JSON.stringify(usr)} insertado!`);
      res.redirect('/');
    }).catch(cause => {
      console.error(cause);
      next(cause);
    });

  });


});

module.exports = router;
