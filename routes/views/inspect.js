var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  
  locals.section = 'inspect';

  locals.scripts = [
    
  ];

  locals.css = [
    
  ];

  view.on('init', function (next) {
    operation.model.find({
      template: true,
      state: 'Granskning'
    }).populate('specialty')
      .exec(function (err, data) {
        locals.operations = data;
        
        next();
      });
  });

  view.render('inspect');
};
