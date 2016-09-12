var keystone = require('keystone');
var findOrCreate = require('mongoose-findorcreate');

var Types = keystone.Field.Types;
var Code = new keystone.List('Code');

// ************************************************************************************************

Code.add({
  title: { type: Types.Text, required: true, initial: true },
  content: { type: Types.Text, required: true, initial: true },
  user: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt: { type: Types.Datetime, 'default': Date.now },
  expires: { type: Types.Datetime, required: true, initial: true, index: true },
  course: { type: Types.Relationship, ref: 'Course' }
});

// ************************************************************************************************

Code.schema.plugin(findOrCreate);
Code.register();
