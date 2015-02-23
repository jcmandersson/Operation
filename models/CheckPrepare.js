var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckPrepare = new keystone.List('Förberedelse', {
  plural: 'Förberedelser',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

CheckPrepare.add({
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'title', required: true, initial: true, index: true },
  name: { type: String, required: true, initial: true },
  process: { type: Types.Relationship, initial: true, ref: 'Processteg', refPath: 'title' },
  checked: { type: Types.Boolean, default: false },
  template: {type: Types.Boolean, default: true}
});

/**
 Relationships
 =============
 */

CheckPrepare.defaultColumns = 'operation, name, createdBy|20%, createdAt|20%';
CheckPrepare.register();

var rest = require('keystone-rest');
rest.addRoutes(CheckPrepare, 'get post put delete');
