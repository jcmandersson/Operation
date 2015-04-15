var keystone = require('keystone');
var operation = keystone.list('Operation');
var session = keystone.session;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.section = 'login';

  locals.scripts = [
    'login.js'
  ];

  locals.css = [
    'login.css'
  ];

  view.on('init', function (next) {
    if (typeof req.query.logout === 'undefined') {
      next();
      return;
    }
    session.signout(req, res, function () {
      res.redirect('/login');
    });
  });

  view.on('post', {login: ''}, function (next) {

    if (!req.body.email || !req.body.password) {
      req.flash('error', 'Skriv in ett giltigt användarnamn och lösenord.');
      return next();
    }
    var onSuccess = function (user) {
      if (req.query.redirect){
        res.redirect(req.query.redirect);
      } else {
        res.redirect('/');
      }
    };

    var onFail = function () {
      req.flash('error', 'Felaktigt användarnamn eller lösenord.');
      return next();
    };

    session.signin(req.body, req, res, onSuccess, onFail);
  });

  view.render('login');

};
