var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Operation = new keystone.List('Operation', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
});

Operation.add({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  author: { type: Types.Relationship, ref: 'User', index: true },
  editDate: { type: Types.Date, index: true, default: Date.now },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 }
  },
  specialty: { type: Types.Relationship, ref: 'Specialty', many: false }
});

Operation.schema.virtual('content.full').get(function() {
  return this.content.extended || this.content.brief;
});

/**
 Relationships
 =============
 */

Operation.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Operation.register();
