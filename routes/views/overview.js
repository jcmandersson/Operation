var keystone = require('keystone');
var operation = keystone.list('Operation');
var specialty = keystone.list('Specialitet');
var checkArticle = keystone.list('Artikel');


exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
      locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'oversikt';

  locals.scripts = [
    'overview.js',
    'removePreparation.js'
  ];

  locals.css = [
    'site/overview.css'
  ];

  locals.specialties = [];
  
  view.on('init', function(next){
    var hidden = typeof req.query.hidden !== 'undefined' ? req.query.hidden : false ;  
    locals.hidden = hidden;
    
    specialty.model.find({}, function(err, docs){
      if(err){
        console.log(err);
        return next();
      }
      docs.forEach(function(e, i){
        view.on('init', function (next) {
          var searchConditions = {template: false, specialty: e._id};
          if (hidden) {
            searchConditions.isDone = false;
          }
          operation.model.find(searchConditions)
          .populate('specialty')
            .exec(function (err, docs) {
              docs.forEach(function(e, i) {
                view.on('init', function(next) {
                  //Check if the operation has any comments.
                  checkArticle.model.find({
                    operation: e._id
                  }).exec( function(err, data) {
                    data.forEach( function(checkbox, j) {
                      if (checkbox.comment !== '' && checkbox.comment !== '-') {
                        docs[i].comment = true;
                        return false;
                      }
                    });
                  });
                  e.calculateProgress(function(progress) {
                    progress.all.percent = progress.all.checked ? parseInt(100*progress.all.checked/progress.all.total) : 0;
                    if (!progress.all.total) {
                      progress.all.percent = 100;
                    }
                    docs[i].progress = progress;
                    next();
                  });
                });
              });
              locals.specialties.push(docs);
              next();
            });
        });
      });
      next();
    });
  });

  view.render('overview');
};
