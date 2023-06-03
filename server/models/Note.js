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
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
