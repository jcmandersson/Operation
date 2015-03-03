var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Comment = new keystone.List('Kommentar', {
  plural: 'Kommentarer',
  autokey: { path: 'slug', from: 'operation', unique: true },
  track: true
});

Comment.add({
  operation: {type: Types.Relationship, ref: 'Operation', refPath: 'title', required: true, initial: true},
  author: {type: Types.Relationship, initial: true, ref: 'User'},
  commentState: {type: Types.Select, options: ['Publicerad', 'Arkiverad'], default: 'Publicerad'},
  text: {type: String, initial: true, required: true}
});

/**
 Relationships
 =============
 */

Comment.defaultColumns = 'operation|20%, author, publishedOn, commentState';
Comment.register();

var rest = require('keystone-rest');
rest.addRoutes(Comment, 'get post put delete');
