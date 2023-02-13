const { Schema, model, Mongoose } = require('mongoose');
const { GraphQLDateTime } = require('graphql-iso-date');
const moment = require('moment');

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 500,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toLocaleDateString('MM/dd/yyyy'),
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timeStamp: true,
  }
);

const Note = model('Note', noteSchema);

module.exports = Note;
