var keystone = require('keystone');
var kartotek = keystone.list('Artikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  locals.scripts = [
  ];

  locals.css = [
    
  ];

  kartotek.model.find()
    .exec(function(err, data) {
      if (err) {
        console.log('DB error');
        console.log(err);
      }
      else {
        locals.checks = data;
        // Render the view
        view.render('index');
      }
  });
};
