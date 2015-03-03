/**
 * Created by pal on 2015-02-26.
 */
var keystone = require('keystone');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');
var content = keystone.list('Processinnehåll');
var article = keystone.list('Artikel');

/**
 * We have a problem with were to put the view.render()
 * */


exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'info';
  locals.scripts = [
    'info.js',
    'checklist.js'
  ];
  
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
        view.render('info');
      } else {
        locals.data = data[0];
        console.log(data);

        article.model.find({
          operation: data[0]._id
        }).populate('kartotek')
          .exec(function (err, articleData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            console.log(articleData);
            locals.articles = articleData;
            view.render('info');
          });
        
        process.model.find({
          operation: data[0]._id
        })
          .exec(function (err, processData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            }
            //console.log(processData);
            processData.forEach(function(e, i){
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
                });
              });
            locals.processes = processData;
            //view.render('info');
          });
        }
    });
};
