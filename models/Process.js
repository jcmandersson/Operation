var keystone = require('keystone'),
  Types = keystone.Field.Types;

var Process = new keystone.List('Processteg', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

Process.add({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  content: { type: Types.Html, wysiwyg: true, height: 400 }
});

/**
 Relationships
 =============
 */

Process.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Process.register();
