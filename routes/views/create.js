var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'create';

  locals.scripts = [
    'jquery.tagsinput.js',
    'create.js',
    'updown-counter.js'
  ];

  locals.css = [
    'site.css'
  ];

  // Render the view
  view.render('create');
};
