var express = require('express');
var router = express.Router();

const User = require('../model/user');
const Meme = require('../model/meme');
const Upvote = require('../model/upvote');
const sessionInitializer = require('../utils/session-init');

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

function insertMemes(user) {
    const ps = [];
    for (let i = 0; i < 20; i++) {
        ps.push(Meme.insert({ usr: user.id, title: `Meme ${i + 1}`, img: 'pic01.jpg' }));
    }
    return Promise.all(ps);
}

router.post('/data', (req, res) => {
    sessionInitializer.initialize()
        .then(e => {
            console.log('Tabla de sesiones creada exitosamente');
        }).catch(cause => {
            console.error('Error al crear tabla de sesiones');
        })

    User.createTable().then(e => {
        console.log('Tabla de usuarios creada');
        return Meme.createTable();
    })
        .then(e => {
            console.log('Tabla de memes creada');
            return Upvote.createTable();
        })
        .then(e => {
            console.log('Tabla de upvotes creada!');
            const userobj = { username: 'franco', name: 'Franco milanese', avatarimg: 'franco_avatar.png', password: 'facho', description: 'Enano culo roto' };
            return User.insert(userobj);
        })
        .then(([usr]) => {
            console.log(`Usuario ${JSON.stringify(usr)} insertado!`);
            return insertMemes(usr);
        })
        .then(e => {
            console.log('Memes insertados!');
            return true;
        })
        .then(b => {
            console.log('Creacion de datos ok');
            res.send({ msg: 'OK' });
        })
        .catch(cause => {
            console.error(cause);
            res.send({ msg: 'FAIL' });
        });
});

module.exports = router;