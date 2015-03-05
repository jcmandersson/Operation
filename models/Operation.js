var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Operation = new keystone.List('Operation', {
  plural: 'Operationer',
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'title', unique: true},
  track: true
});

Operation.add({
  title: {type: String, required: true},
  linda_id: {type: String, default: '0', required: true},
  tags: { type: String },
  state: {type: Types.Select, options: 'Utkast, Publicerad, Arkiverad', default: 'Utkast'},
  specialty: {type: Types.Relationship, ref: 'Specialitet', many: false},
  template: {type: Types.Boolean, default: true}
});

/**
 Relationships
 =============
 */

Operation.relationship({path: 'processes', ref: 'Processteg', refPath: 'operation'});
Operation.relationship({path: 'articles', ref: 'Artikel', refPath: 'operation'});
Operation.relationship({path: 'prepares', ref: 'Förberedelse', refPath: 'operation'});
Operation.relationship({path: 'comments', ref: 'Kommentar', refPath: 'operation'});

Operation.schema.statics.search = function(text, callback) {
  var search = new RegExp(text, 'ig');
  return this.model('Operation').find({
    $or: [{
      title: search
    }, {
      tags: search
    }]
  });
};

Operation.schema.statics.fromTemplate = function fromTemplate(slug, callback) {
  var thisDoc = this;
  
  this.model('Operation').findOne({ 
      slug: slug 
  }).exec(function(err, doc) {
    if(err) console.log(err);
    
    var newObject = JSON.parse(JSON.stringify(doc));
    delete newObject._id;
    newObject.template = false;
    
    var newDoc = new Operation.model(newObject);
    newDoc.save(function(err, savedDoc){
      if(err) console.log(err);
      thisDoc.model('Artikel').fromTemplate(doc._id, savedDoc._id);
      thisDoc.model('Förberedelse').fromTemplate(doc._id, savedDoc._id);
      thisDoc.model('Processteg').fromTemplate(doc._id, savedDoc._id);
      callback(savedDoc);
    });
  });
};

Operation.schema.methods.calculateProgress = function calculateProgress(cb){
  var thisOp = this;
  
  thisOp.model('Artikel').calculateProgress(thisOp, function(articleProgress){
    thisOp.model('Förberedelse').calculateProgress(thisOp, function(prepareProgress){
      var data = {
        article: articleProgress,
        prepare: prepareProgress,
        all: {
          total: articleProgress.total + prepareProgress.total,
          checked: articleProgress.checked + prepareProgress.checked
        }
      };
      
      cb(data);
    });
  });
};

Operation.defaultColumns = 'title, state|20%, updatedBy|20%, updatedAt|20%';
Operation.register();

var rest = require('keystone-rest');
rest.addRoutes(Operation, 'get post put delete');
