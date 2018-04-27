var express = require('express');
var router = express.Router();

var loginMiddleware = require('../middleware/login');
var formidable = require('formidable');

var fs = require('fs');
var path = require('path');

const Meme = require('../model/meme');

/* GET users listing. */
router.get('/', loginMiddleware, function (req, res, next) {
  res.render('meme_upload', { title: 'Subir meme' });
});

router.post('/', (req, res) => {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    const title = fields.title;
    if(!title) {
      res.message('No se ingreso un titulo');
      return res.redirect('back');
    }

    const imgfile = files.imgfile;
    if(imgfile.size == 0) {
      res.message('No se envio un archivo');
      return res.redirect('back');
    }
    // const destPath = path.join(__dirname , imgfile.name);

    const img = `${Date.now()}_${imgfile.name}`;
    const destPath = path.join(process.env.MEME_IMG_DIR, img);
    fs.createReadStream(imgfile.path).pipe(fs.createWriteStream(destPath));

    const userId = req.session.uid;
    Meme.insert({ usr: userId, title: fields.title, img }).then(m => {
      console.log(`Meme ${JSON.stringify(m)} insertado!`);
      res.message('Meme creado!');
      res.redirect('back');
    }).catch(cause => {
      res.message('Error al crear meme','error');
      console.error(cause);
      res.redirect('back');
    })
  });
});

module.exports = router;
