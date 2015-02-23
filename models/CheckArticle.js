var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckArticle = new keystone.List('Artikel', {
  plural: 'Artiklar',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true
});

CheckArticle.add({
  operation: { type: Types.Relationship, ref: 'Operation', refPath: 'title', required: true, initial: true, index: true },
  name: { type: String, required: true, initial: true },
  checked: { type: Types.Boolean, default: false },
  template: { type: Types.Boolean, default: true },
  kartotek: { type: Types.Relationship, ref: 'Kartotek artikel', refPath: 'name', initial: true}
});


/**
 Relationships
 =============
 */

CheckArticle.defaultColumns = 'operation, name, createdBy|20%, createdAt|20%';
CheckArticle.register();

var rest = require('keystone-rest');
rest.addRoutes(CheckArticle, 'get post put delete');
