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
  tags: {type: String},
  state: {type: Types.Select, options: 'Utkast, Redigering, Granskning, Publicerad', default: 'Utkast'},
  specialty: {type: Types.Relationship, ref: 'Specialitet', many: false},
  template: {type: Types.Boolean, default: true},
  isDone: {type: Types.Boolean, default: false}
});

/**
 Relationships
 =============
 */

Operation.relationship({path: 'processes', ref: 'Processteg', refPath: 'operation'});
Operation.relationship({path: 'articles', ref: 'Artikel', refPath: 'operation'});
Operation.relationship({path: 'comments', ref: 'Kommentar', refPath: 'operation'});

Operation.schema.statics.search = function (text, callback) {
  var search = new RegExp(text, 'ig');
  return this.model('Operation').find({
    $or: [{
      title: search,
      template: true
    }, {
      tags: search,
      template: true
    }]
  });
};

Operation.schema.statics.createOperation = function createOperation(title, specialty, callback) {
  var thisDoc = this;

  var OperationModel = this.model('Operation');

  new OperationModel({
    title: title,
    tags: '',
    specialty: specialty
  }).save(function (err, savedDoc) {
      if (err) {
        console.log('Operationen kunde inte skapas.!');
        return;
      }

      OperationModel.findOne({
        slug: 'mall'
      }, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Sparar...');
        console.log(doc);
        console.log(savedDoc);
        thisDoc.model('Processteg').cloneToOperation(doc._id, savedDoc._id, function () {
          console.log('Psteg');
          thisDoc.model('Artikel').cloneToOperation(doc._id, savedDoc._id, function () {
            console.log('artikel');
            callback(savedDoc);
          });
        });
      });
    });
};

Operation.schema.statics.fromTemplate = function fromTemplate(slug, callback) {
  var thisDoc = this;

  this.model('Operation').findOne({
    slug: slug
  }).exec(function (err, doc) {
    if (err) console.log(err);

    var newObject = JSON.parse(JSON.stringify(doc));
    delete newObject._id;
    delete newObject.slug;
    newObject.template = false;

    var newDoc = new Operation.model(newObject);
    newDoc.save(function (err, savedDoc) {
      if (err) console.log(err);
      thisDoc.model('Processteg').cloneToOperation(doc._id, savedDoc._id, function () {
        thisDoc.model('Artikel').cloneToOperation(doc._id, savedDoc._id, function () {
          callback(savedDoc);
        });
      });
    });
  });
};

Operation.schema.methods.calculateProgress = function calculateProgress(cb) {
  var thisOp = this;

  thisOp.model('Artikel').calculateProgress(thisOp, function (articleProgress) {
    //thisOp.model('Förberedelse').calculateProgress(thisOp, function (prepareProgress) {
      var data = {
        article: articleProgress,
        prepare: articleProgress,
        all: {
          total: articleProgress.total + articleProgress.total,
          checked: articleProgress.checked + articleProgress.checked
        }
      };

      cb(data);
    //});
  });
};

Operation.defaultColumns = 'title, state|20%, updatedBy|20%, updatedAt|20%';
Operation.register();

var rest = require('keystone-rest');
rest.addRoutes(Operation, 'get post put delete');
