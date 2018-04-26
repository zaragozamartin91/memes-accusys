var express = require('express');

/*The express.response object is the prototype that Express uses, for the response objects. Adding properties to this object means 
they’ll then be available to all middleware and routes alike*/
var res = express.response;

/*La siguiente funcion expande las funcionalidades de express response agregando el metodo "message" el cual agrega un mensaje a 
req.session.messages*/
res.message = function(msg, type = 'info') {
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({
        type: type,
        string: msg
    });
};


/*El siguiente middleware carga en res.locals los mensajes de la sesion y agrega en res.locals una funcion para eliminar/limpiar
mensajes. Las variables de res.locals son expuestas a los Templates.*/
module.exports = function(req, res, next) {
    res.locals.messages = req.session.messages || [];
    res.locals.removeMessages = function() {
        console.log('Removiendo mensajes...');
        req.session.messages = [];
    };

    console.log("res.locals.messages: " + res.locals.messages);
    next();
};