var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'search';

  operation.model.search(req.search, function (err, data) {
    if (err) {
      res.status(500).render('errors/500', {
        err: err,
        errorTitle: 'Databasfel',
        errorMsg: 'Kunde inte söka i databasen'
      });
      return;
    }
    locals.db = data.toString();
    view.render('search');
  });
};
