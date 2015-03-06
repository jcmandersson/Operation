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
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'specialiteter';
  

  view.on('init', function (next) {
    console.log("Specialiteter");
    speciality.model.find({      
    }).exec( function(err, data) {
      if (err) {
        console.log('DB error');
        console.log(err);
        return;
      } else {
        locals.specialities = data;
        console.log(data);
      }      
      console.log(locals.specialities);
      _.each(locals.specialities, function(process, i) {
        operation.model.find({ speciality: data._id }).exec( function(err, data) {
          if (err) {
            console.log('DB error');
            console.log(err);
            return;
          } else {
            //locals.operations = [];
            //locals.operations[process._id] = data;
            process.op = data;
            console.log(data[0].slug);
          }
          next();
        });
      });
      

      

     
      
    });
       
  });
  view.render('specialiteter');
  
};
