var keystone = require('keystone');
var kartotek = keystone.list('Kartotekartikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  locals.section = 'kartotek';

  locals.scripts = [
    'kartotek.js'
  ];

  locals.css = [
    'site/kartotek.css'
  ];

  kartotek.model.find()
    .sort('name')
    .limit(50)
    .exec(function(err, data) {
    if (err) {
      console.log('DB error');
      console.log(err);
    }
    else {
      locals.articles = data.reverse();
      // Render the view
      view.render('kartotek');
    }
  });
};
