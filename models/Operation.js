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
  slug: {type: String, index: true},
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

Operation.defaultColumns = 'title, state|20%, updatedBy|20%, updatedAt|20%';
Operation.register();

var rest = require('keystone-rest');
rest.addRoutes(Operation, 'get post put delete');
rest.registerRoutes(keystone.app);
