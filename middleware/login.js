module.exports = function (req, res, next) {
  console.log('SESSION user: ' + req.session.uid);
  if (req.session.uid) return next();
  res.render('login', { title: 'Iniciar sesion' });
};