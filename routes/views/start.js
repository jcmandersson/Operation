var keystone = require('keystone');
var kartotek = keystone.list('Artikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'oversikt';

  locals.scripts = [
    'oversikt.js'
  ];
  
  view.render('oversikt');
};
