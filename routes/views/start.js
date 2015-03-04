var keystone = require('keystone');
var operation = keystone.list('Operation');
var checkArticle = keystone.list('Artikel');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'oversikt';

  locals.scripts = [
    'oversikt.js'
  ];

  view.on('init', function (next) {
    operation.model.find({
      //template: false
    }).populate('specialty')
      .exec(function (err, docs) {
        locals.operations = docs; 
        locals.operations.forEach(function(e, i){
          view.on('init', function(next){
            e.calculateProgress(function(progress){
              progress.all.percent = progress.all.checked ? parseInt(100*progress.all.checked/progress.all.total) : 0;
              if(!progress.all.total){
                progress.all.percent = 100;
              }
              locals.operations[i].progress = progress;
              console.log(progress);
              next();
            });
          });
        });

        next();
      });
  });

  view.render('oversikt');
};
