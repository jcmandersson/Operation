var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var model = keystone.list(req.params.model);
  model.model.search(req.query.text, function (err, data) {
    if (err) {
      res.status(500).render('errors/500', {
        err: err,
        errorTitle: 'Databasfel',
        errorMsg: 'Kunde inte söka i databasen'
      });
      return;
    }
    if (req.query.text !== '') {
      if (typeof(req.query.limit) === 'undefined') {
        res.send(data.slice(0, 10));
      }
      else {
        res.send(data.slice(0, req.query.limit));
      }
    }
    else {
      res.send([]);
    }
  });
};
