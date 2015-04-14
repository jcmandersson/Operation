/**
 * Created by abbe on 2015-02-27.
 */
var keystone = require('keystone'),
  Types = keystone.Field.Types;

var ProcessContent = new keystone.List('Processinnehall', {
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'title', unique: true},
  track: true
});

ProcessContent.add({
  order: {type: Number, required: true, default: 0},
  title: {type: String, required: true},
  text: {type: Types.Html, wysiwyg: true, height: 400},
  process: {type: Types.Relationship, ref: 'Processteg', many: true, initial: true, required: true},
  checkAble: {type: Types.Boolean, required: false, default: true}, //TODO: Borde vara required
  checked: {type: Types.Boolean, required: false, default: false}
});

ProcessContent.schema.statics.calculateProgress = function calculateProgress(operationId, callback) {
  var model = this.model('Processinnehall');
  var processModel = this.model('Processteg');
  
  processModel.find({
    operation: operationId
  }, function(err, docs){
    if(err) console.log(err);

    var $or = [];
    for(var i = 0; i < docs.length; ++i){
      $or.push({
        process: docs[i]._id
      });
    }
    
    model.find({
      $or: $or,
      checkAble: true
    }).exec(function(err, data){
      if(err) console.log(err);

      var totalCheckboxes = data.length;

      model.find({
        $or: $or,
        checkAble: true,
        checked: true
      }).exec(function(err, checkedData){
        if(err) console.log(err);

        var checkedBoxes = checkedData.length;
        callback({
          total: totalCheckboxes,
          checked: checkedBoxes
        });
      });
    });
  });
};

ProcessContent.schema.statics.cloneToProcess = function cloneToProcess(processId, newProcessId, callback) {
  var thisDoc = this;
  
  this.model('Processinnehall').find({
    process: processId
  }).exec(function (err, docs) {
    if (err) console.log(err);
    
    for (var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      var newObject = JSON.parse(JSON.stringify(doc));
      delete newObject._id;
      delete newObject.slug;
      newObject.process = newProcessId;

      var newDoc = new ProcessContent.model(newObject);
      var saving = true;
      newDoc.save(function (err, savedDoc) {
        if (err) console.log(err);
        saving = false;
      });
      while (saving) {
        require('deasync').runLoopOnce();
      }
    }
    callback();
  });
};

ProcessContent.register();

var rest = require('keystone-rest');
rest.addRoutes(ProcessContent, 'get post put delete');
