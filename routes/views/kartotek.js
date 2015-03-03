var keystone = require('keystone');
//var kartotek = keystone.list('KartotekArticle');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'kartotek';

  /*
  locals.scripts = [
    'kartotek.js'
  ];

  kartotek.model.search()
    .exec(function(err, data) {
    if (err) {
      console.log('DB error');
      console.log(err);
    }
    else {
      //locals.checks = data;
      locals.checks = [{_id: '0', name:'a', storage:'b', section: 'c', shelf: 'd', tray:'e'}];
      // Render the view
      view.render('kartotek');
    }
  });
  */
  view.render('kartotek');
};
