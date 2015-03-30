var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckArticle = new keystone.List('Artikel', {
  plural: 'Artiklar',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

CheckArticle.add({
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'articles', required: true, initial: true },
  name: { type: String, required: true, initial: true },
  checked: { type: Types.Boolean, default: false },
  template: { type: Types.Boolean, default: true },
  kartotek: { type: Types.Relationship, ref: 'Kartotekartikel', refPath: 'kartotek', initial: true},
  amount: { type: Types.Number, default: 1 },
  comment: {type: String, required: false, default: ""}
});

/**
 Relationships
 =============
 */

CheckArticle.schema.statics.fromTemplate = function fromTemplate(operationId, newOperationId, callback) {
  var thisDoc = this;

  this.model('Artikel').find({
    operation: operationId
  }).exec(function(err, docs) {
    if(err) console.log(err);
    for(var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      var newObject = JSON.parse(JSON.stringify(doc));
      delete newObject._id;
      delete newObject.slug;
      newObject.operation = newOperationId;
      newObject.template = false;

      var newDoc = new CheckArticle.model(newObject);
      var saving = true;
      newDoc.save(function(err, savedDoc){
        if(err) console.log(err);
        saving = false;
      });
      while(saving) {
        require('deasync').runLoopOnce();
      }
    }
    callback();
  });
};

CheckArticle.schema.statics.calculateProgress = function calculateProgress(operationId, callback) {
  var model = this.model('Artikel');
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

CheckArticle.defaultColumns = 'operation|20%, name, createdBy|20%, createdAt|20%';
CheckArticle.register();

var rest = require('keystone-rest');
rest.addRoutes(CheckArticle, 'get post put delete');
