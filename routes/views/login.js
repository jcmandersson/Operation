var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  locals.section = 'login';

  locals.scripts = [
    'login.js'
  ];

  locals.css = [
    'site.css'
  ];

  view.render('login');
};
