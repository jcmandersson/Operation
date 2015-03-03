var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckPrepare = new keystone.List('Förberedelse', {
  plural: 'Förberedelser',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

CheckPrepare.add({
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'prepares', required: true, initial: true },
  name: { type: String, required: true, initial: true },
  process: { type: Types.Relationship, initial: true, ref: 'Processteg', refPath: 'title' },
  checked: { type: Types.Boolean, default: false },
  template: {type: Types.Boolean, default: true}
});

/**
 Relationships
 =============
 */

CheckPrepare.schema.statics.fromTemplate = function fromTemplate(operationId, newOperationId, callback) {
  var thisDoc = this;

  this.model('Förberedelse').find({
    operation: operationId
  }).exec(function(err, docs) {
    if(err) console.log(err);
    console.log(docs);
    for(var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      var newObject = JSON.parse(JSON.stringify(doc));
      delete newObject._id;
      newObject.operation = newOperationId;
      newObject.template = false;

      var newDoc = new CheckPrepare.model(newObject);
      newDoc.save(function(err, savedDoc){
        if(err) console.log(err);

      });
    }
  });
};

CheckPrepare.schema.statics.calculateProgress = function calculateProgress(operationId, callback) {
  var model = this.model('Förberedelse');
  model.find({
    operation: operationId
  }).exec(function(err, data){
    if(err) console.log(err);

    var totalCheckboxes = data.length;

    model.find({
      operation: operationId,
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

};

CheckPrepare.defaultColumns = 'operation|20%, name, createdBy|20%, createdAt|20%';
CheckPrepare.register();

var rest = require('keystone-rest');
rest.addRoutes(CheckPrepare, 'get post put delete');
