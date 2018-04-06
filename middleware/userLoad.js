
/*El modulo se encargara de asignar el usuario que inicio sesion en req.user para que este disponible para los templates.*/
module.exports = function (req, res, next) {
    console.log('Asignando usuario a req');
    var uid = req.session.uid;
    if (!uid) {
        console.log("userLoad::NO HAY uid ASIGNADO!");
        return next();
    }

    getUser(uid).then(user => {
        req.user = res.locals.user = user;
        req.userEmail = res.locals.userEmail = user.email;
        next();
    });
};

//TODO: HACER LOGICA DE CARGA DE USUARIO
function getUser(uid) {
    return Promise.resolve({
        email: 'foo@bar.com',
        username: 'foo',
        id: 123
    });
}