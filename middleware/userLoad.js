const User = require('../model/user');

/*El modulo se encargara de asignar el usuario que inicio sesion en req.user para que este disponible para los templates.*/
module.exports = function (req, res, next) {
    console.log('Asignando usuario a req');
    var uid = req.session.uid;
    if (!uid) {
        console.log("userLoad::NO HAY uid ASIGNADO!");
        return next();
    }

    getUser(uid).then( ([user]) => {
        req.userEmail = res.locals.userEmail = user.email;
        req.userName = res.locals.userName = user.name;
        req.userDesc = res.locals.userDesc = user.description;
        req.userAvatarimg = res.locals.userAvatarimg = user.avatarimg;

        console.log('Cargando usuario ' + JSON.stringify(user));

        next();
    });
};

//TODO: HACER LOGICA DE CARGA DE USUARIO
function getUser(uid) {
    
    return User.findById(uid);
}