/**
 * Created by abbe on 2015-02-20.
 */
var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Comment = new keystone.List('Kommentar', {
  label: 'Kommentarer',
  singular: 'Kommentar',
  defaultSort: '-publishedOn'
});

Comment.add({
    author: { type: Types.Relationship, initial: true, ref: 'Användare', index: true },
    operation: { type: Types.Relationship, initial: true, ref: 'Operation', index: true },
    commentState: { type: Types.Select, options: ['Publicerad', 'Arkiverad'], default: 'Publicerad', index: true },
    publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true },
    text: { type: String, initial: true, required: true}
});


/**
 Relationships
 =============
 */

Comment.defaultColumns = 'author, post, publishedOn, commentState';
Comment.register();
