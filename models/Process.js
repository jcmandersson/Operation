var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Process = new keystone.List('Processteg', {
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'title', unique: true},
  track: true
});

Process.add({
  title: {type: String, required: true},
  operation: {
    type: Types.Relationship,
    ref: 'Operation',
    refPath: 'processes',
    required: true,
    initial: true,
    index: true
  }
});

/**
 Relationships
 =============
 */


Process.schema.statics.cloneToOperation = function cloneToOperation(operationId, newOperationId, callback) {
  var thisDoc = this;

  this.model('Processteg').find({
    operation: operationId
  }).exec(function (err, docs) {
    if (err) console.log(err);
    
    for (var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      var newObject = JSON.parse(JSON.stringify(doc));
      delete newObject._id;
      delete newObject.slug;
      newObject.operation = newOperationId;

      var newDoc = new Process.model(newObject);
      var saving = true;
      newDoc.save(function (err, savedDoc) {
        if (err) console.log(err);

        thisDoc.model('Processinnehall').cloneToProcess(doc._id, savedDoc._id, function () {
          saving = false;
        });
      });
      while (saving) {
        require('deasync').runLoopOnce();
      }
    }
    callback();
  });
};

Process.defaultColumns = 'operation|20%, title, createdBy|20%, createdAt|20%';
Process.register();

var rest = require('keystone-rest');
rest.addRoutes(Process, 'get post put delete');
