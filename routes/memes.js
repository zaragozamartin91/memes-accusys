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
    const imgfile = files.imgfile;
    // const destPath = path.join(__dirname , imgfile.name);
    const destPath = path.join(process.env.MEME_IMG_DIR, `${Date.now()}_${imgfile.name}`);
    fs.createReadStream(imgfile.path).pipe(fs.createWriteStream(destPath));

    const userId = req.session.uid;
    

    res.send({ fields: fields, files: files , destPath });
  });
});

module.exports = router;
