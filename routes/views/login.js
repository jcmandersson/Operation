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
    'site.css',
    'login.css'
  ];
  
  view.on('post', {login: ''}, function (next) {

    if (!req.body.email || !req.body.password) {
      req.flash('error', 'Skriv in ett giltigt användarnamn och lösenord.');
      return next();
    }
    var onSuccess = function(user) {
      if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/)) {
        res.redirect(req.query.from);
      } else if ('string' === typeof keystone.get('login redirect')) {
        res.redirect(keystone.get('login redirect'));
      } else if ('function' === typeof keystone.get('login redirect')) {
        keystone.get('login redirect')(user, req, res);
      } else {
        res.redirect('/');
      }
    };

    var onFail = function() {
      req.flash('error', 'Felaktigt användarnamn eller lösenord.');
      return next();
    };

    session.signin(req.body, req, res, onSuccess, onFail);
  });

  view.render('login');

};
