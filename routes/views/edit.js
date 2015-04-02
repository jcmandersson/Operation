var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');
var content = keystone.list('Processinnehall');
var article = keystone.list('Artikel');
var mongoose = require('mongoose');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'create';

  locals.scripts = [
    'jquery.tagsinput.js',
    'lib/jquery.iframe-post-form.js',
    //'lib/jQuery-TE_v.1.4.0/jquery-te-1.4.0.min.js',
    'lib/tinymce/tinymce.min.js',
    'updown-counter.js',
    'lib/dateFormat.js',
    'edit.js'
  ];

  locals.css = [
    'lib/dropzone.css',
    'site/edit.css'
  ];

  view.on('init', function (next) {
    operation.model.find({
      slug: req.params.slug
    }).populate('specialty')
      .exec(function (err, data) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        } else if (data.length) {
          locals.data = data[0];
        }
        next(err);
      });
  });

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    article.model.find({
      operation: locals.data._id
    }).populate('kartotek')
      .exec(function (err, articleData) {
        if (err) {
          console.log('DB error');
          console.log(err);
          return;
        }
        locals.articles = articleData;
        next(err);
      });
  });

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
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

  view.on('init', function (next) {
    if (typeof locals.data === 'undefined') {
      next();
      return;
    }
    locals.processes.forEach(function (e, i) {
      view.on('init', function (next) {
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


  view.on('init', function (next) {
    if (typeof locals.processes === 'undefined') locals.processes = [];
    /*locals.processes.push({
     title: 'Ny'
     });*/
    // TODO, add standard processes.
    next();
  });

  // Render the view
  view.render('edit');
};
