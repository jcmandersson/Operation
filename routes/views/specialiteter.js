/**
 * Created by abbe on 2015-03-04.
 */
var keystone = require('keystone');
var speciality = keystone.list('Specialitet');
var operation = keystone.list('Operation');
var _ = require('underscore');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  locals.scripts = [
    'specialiteter.js'
  ];

  locals.css = [
    'site.css'
  ];

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'specialiteter';


  view.on('init', function (next) {
    speciality.model.find({      
    }).exec( function(err, data) {
      if (err) {
        console.log('DB error');
        console.log(err);
        return;
      } else {
        locals.specialities = data;
      }
      _.each(locals.specialities, function(process, i) {
        view.on('init', function(next){
          console.log('['+process._id+']');
          operation.model.find({ 
            specialty: process._id,
            template: true
          })
            .exec( function(err, operationData) {
            if (err) {
              console.log('DB error');
              console.log(err);
              return;
            } else {
              //locals.operations = [];
              //locals.operations[process._id] = data;
              console.log(operationData);
              process.op = operationData;
              console.log(process);              
              console.log('\n\n')
              
            }
            next();
          });
        });        
      });
      next();
    });
  });
  view.render('specialiteter');
  
};
