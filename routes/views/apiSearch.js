var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  operation.model.search(req.query.text, function (err, data) {
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
  });
};
