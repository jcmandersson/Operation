var keystone = require('keystone'),
  Types = keystone.Field.Types;

var CheckArticle = new keystone.List('Artikel', {
  autokey: { path: 'id', from: 'operation', unique: true }
});

CheckArticle.add({
  id: { type: String, index: true },
  operation: { type: Types.Relationship, ref: 'Operation', index: true },
  name: { type: String, required: true },
  author: { type: Types.Relationship, ref: 'User', index: true }
});

/**
 Relationships
 =============
 */

CheckArticle.defaultColumns = 'operation, name, author|20%';
CheckArticle.register();
