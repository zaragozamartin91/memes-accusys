var express = require('express');
var router = express.Router();

var loginMiddleware = require('../middleware/login');

const Meme = require('../model/meme');

const PAGE_SIZE = 10;

/* GET home page. */
router.get('/', loginMiddleware, function (req, res, next) {
    const page = req.session.page || 0;
    Meme.find({ all: false, page, pageSize: PAGE_SIZE }).then(memes => {
        res.render('index', { title: 'Memes accusyanos', memes, page });
    });
});

router.get('/next', (req, res) => {
    Meme.count().then(([{ count }]) => {
        const maxPageIdx = Math.floor(count / PAGE_SIZE);
        const page = req.session.page || 0;
        req.session.page = page >= maxPageIdx ? maxPageIdx : page + 1;
        res.redirect('/');
    });
});

router.get('/previous', (req, res) => {
    const page = req.session.page || 0;
    req.session.page = page <= 0 ? 0 : page - 1;
    res.redirect('/');
});

router.get('/index', (req, res) => {
    res.redirect('/');
});


module.exports = router;
