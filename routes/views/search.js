var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'search';
  
  locals.scripts = [
    'search.js'
  ];

  // Render the view
  view.render('search');
};
