/**
 * Created by pal on 2015-02-26.
 */
var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');
var content = keystone.list('Processinnehall');
var article = keystone.list('Artikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  locals.section = 'info';
  locals.scripts = [
    'info.js',
    'checklist.js',
    'checkEffect.js'
  ];

  locals.css = [
    'site/info.css'
  ];

  view.on('get', {operation: 'create'}, function(){
    console.log("AAAA: " + req.params.slug);
    operation.model.fromTemplate(req.params.slug, function(newOperation){
      console.log(newOperation);

      operation.model.findOne({slug: newOperation.slug }, function (err, data){
        if(err){
          console.log('Operationen kunde inte ändras.');
          return;
        }
        data.linda_id = req.query.linda;
        data.save(); 
      });

      res.redirect("/info/" + newOperation.slug);
    });
  });

  view.on('init', function(next) {
    operation.model.find({
      slug: req.params.slug
    }).populate('specialty')
      .exec(function (err, data) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        } else if (data.length === 0) {
          locals.data = {title: "Sidan finns ej"}
          //view.render('info');
        } else {
          locals.data = data[0];
          console.log(data);
        }
        next(err);
      });
  });

  view.on('init', function(next) {
    article.model.find({
      operation: locals.data._id
    }).populate('kartotek')
      .exec(function (err, articleData) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        }
        //console.log(articleData);
        locals.articles = articleData;
        next(err);
      });
  });

  view.on('init', function(next) {
    process.model.find({
      operation: locals.data._id
    })
      .exec(function (err, processData) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        }
        //console.log(processData);
        locals.processes = processData;
        //console.log(locals.processes);
        next(err);
      });
  });

  view.on('init', function(next) {
    locals.processes.forEach(function (e, i) {
      view.on('init', function(next) {
        content.model.find({
          process: e._id
        })
          .exec(function (err, contentData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            //console.log(contentData);
            e.contents = contentData;
            next(err);
          });
      });
    });
    next(null);
  });
  
  view.render('info');

};
