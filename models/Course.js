'use strict';

const keystone = require('keystone');
const findOrCreate = require('mongoose-findorcreate');

const Types = keystone.Field.Types;
const Course = new keystone.List('Course');

// ************************************************************************************************

Course.add({
  name: { type: Types.Text, required: true, initial: true, index: true },
  courseId: { type: Types.Text, required: true, initial: true, index: true },
  combined: { type: Types.Text },
  language: { type: Types.Text },
  expireTime: { type: Types.Number, required: true, initial: true, format: '0' },
  createdBy: { type: Types.Relationship, ref: 'User' },
  createdAt: { type: Types.Datetime, 'default': Date.now }
});

// ************************************************************************************************

Course.schema.plugin(findOrCreate);
Course.register();
