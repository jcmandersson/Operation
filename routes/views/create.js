var keystone = require('keystone');
var kartotekArticle = keystone.list('Kartotek artikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'create';
  
  kartotekArticle.model.search('knife', function (err, data) {
    if (err) {
      console.log('DB error');
      return;
    }
    console.log(data);
    locals.db = data[0].name;
    //locals.db = data.toString();
    view.render('create');
  });
  
  
  
  // Render the view
  //view.render('create');

};
