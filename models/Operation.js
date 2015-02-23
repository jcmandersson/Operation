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
  tags: { type: String },
  state: {type: Types.Select, options: 'Utkast, Publicerad, Arkiverad', default: 'Utkast', index: true},
  specialty: {type: Types.Relationship, ref: 'Specialitet', many: false},
  template: {type: Types.Boolean, default: true}
});

/**
 Relationships
 =============
 */


Operation.relationship({ref: 'Processteg', path: 'operation'});
Operation.relationship({ref: 'Artikel', path: 'operation'});
//Operation.relationship({ ref: 'Kommentar' , path: 'operation' });

Operation.schema.statics.search = function(text, callback) {
  var search = new RegExp(text, 'ig');
  this.model('Operation').find({
    $or: [{
      title: search
    }, {
      tags: search
    }]
  }).populate('createdBy') //Lägger in all data om användaren som skapade operationen
    .populate('updatedBy')
    .populate('Processteg')
    .populate('Förberedelse')
    .populate('Artikel') //Hämtar alla artiklar i plocklistan
    .populate('specialty') 
    .sort('-updatedAt')//Sorterar efter updatedAt, - säger att den sorterar bakvänt, dvs. med högst först.
    .exec(callback);
};

/*
var objectIdDel = function(copiedObjectWithId) {
  if (copiedObjectWithId != null && typeof(copiedObjectWithId) != 'string' &&
    typeof(copiedObjectWithId) != 'number' && typeof(copiedObjectWithId) != 'boolean' ) {
    //for array length is defined however for objects length is undefined
    if (typeof(copiedObjectWithId.length) == 'undefined') {
      delete copiedObjectWithId._id;
      for (var key in copiedObjectWithId) {
        objectIdDel(copiedObjectWithId[key]); //recursive del calls on object elements
      }
    }
    else {
      for (var i = 0; i < copiedObjectWithId.length; i++) {
        objectIdDel(copiedObjectWithId[i]);  //recursive del calls on array elements
      }
    }
  }
}

Operation.schema.methods.copyTemplate = function() {
  this.lastActiveOn = new Date();
  return this;
};*/

Operation.defaultColumns = 'title, state|20%, updatedBy|20%, updatedAt|20%';
Operation.register();

var rest = require('keystone-rest');
rest.addRoutes(Operation, 'get post put delete');
