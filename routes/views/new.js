var keystone = require('keystone');
var operation = keystone.list('Operation');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'new';

  locals.scripts = [
    'new.js'
  ];

  locals.css = [
    'site/edit.css'
  ];

  view.on('post', function (next) {
    console.log( req.body );
    var name = req.body.name;
    var specialty = req.body.specialty;

    operation.model.createOperation(name, specialty, function(operation){
      console.log(operation);
      res.redirect('/edit/'+operation.slug);
    });
  });

  view.on('init', function (next) {
    operation.model.find({
      template: false
    }).populate('specialty')
      .exec(function (err, docs) {
        locals.operations = docs; 
        locals.operations.forEach(function(e, i) {
          view.on('init', function(next) {
            e.calculateProgress(function(progress) {
              progress.all.percent = progress.all.checked ? parseInt(100*progress.all.checked/progress.all.total) : 0;
              if (!progress.all.total) {
                progress.all.percent = 100;
              }
              locals.operations[i].progress = progress;
              next();
            });
          });
        });

        next();
      });
  });

  view.render('new');
};
