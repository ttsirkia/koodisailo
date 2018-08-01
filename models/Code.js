'use strict';

const keystone = require('keystone');
const findOrCreate = require('mongoose-findorcreate');

const Types = keystone.Field.Types;
const Code = new keystone.List('Code');

// ************************************************************************************************

Code.add({
  title: { type: Types.Text, required: true, initial: true },
  content: { type: Types.Text, required: true, initial: true },
  user: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt: { type: Types.Datetime, 'default': Date.now },
  expires: { type: Types.Datetime, required: true, initial: true, index: true },
  course: { type: Types.Relationship, ref: 'Course' },
  public: { type: Types.Boolean, initial: true}
});

// ************************************************************************************************

Code.schema.plugin(findOrCreate);
Code.register();
