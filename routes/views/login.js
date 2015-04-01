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

  var renderView = function() {
    view.render('login');
  };

  if (req.method === 'GET') {
    if (!keystone.security.csrf.validate(req)) {
      req.flash('error', 'There was an error with your request, please try again.');
      return renderView();
    }

    if (!req.body.email || !req.body.password) {
      req.flash('error', 'Please enter your email address and password.');
      return renderView();
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
      req.flash('error', 'Sorry, that email and password combo are not valid.');
      renderView();
    };

    session.signin(req.body, req, res, onSuccess, onFail);
  }
  else {
    renderView();
  }

};
