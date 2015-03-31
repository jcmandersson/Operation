var keystone = require('keystone');
var async = require('async');
var mongoose = require('mongoose');
var operation = keystone.list('Operation');
var process = keystone.list('Processteg');

var Operation = [{
  title: 'Mall',
  template: true
}];

exports = module.exports = function(done) {
  operation.model.remove({title: 'Mall'}, function(err){
    if(err){
      console.log(err);
      return;
    }

    for(var i = 0; i < Operation.length; ++i) {
      new operation.model(Operation[i]).save(function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }

        var Processes = [{
          title: 'Anestesi',
          operation: doc._id
        }, {
          title: 'Patientpositionering',
          operation: doc._id
        }, {
          title: 'Preoparea',
          operation: doc._id
        }];

        for (var j = 0; j < Processes.length; ++j) {
          new process.model(Processes[j]).save(function (err, doc) {
            if (err) {
              console.log(err);
              return;
            }
          });
        }
        done();

      });
    }
  });
  
};

//exports.__defer__ = true;
