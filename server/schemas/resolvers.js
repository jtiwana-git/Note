const { User, Note } = require('../models');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/auth.js');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../utils/gravatar.js');
const Mongoose = require('mongoose');
const { populate } = require('../models/User');

const resolvers = {
  Query: {
    // WORKS
    user: async (parent, args, { username }) => {
      return User.findOne({ username: args.username });
    },

    // WORKS
    users: async () => {
      return await User.find().populate('notes');
    },

    // NOT WORKING
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ id: args.user.id })
          .populate('notes')
          .populate('favorites');
      }
    },

    // WORKS
    notes: async (parent, args) => {
      return await Note.find().limit(100).populate('author');
    },

    // WORKS
    note: async (parent, args) => {
      return await Note.findById(args.id);
    },

    noteFeed: async (parent, args, { cursor }, context) => {
      const limit = 10;
      let hasNextPage = false;
      // This will pull the newest notes from the db
      let cursorQuery = {};
      console.log('Cursor 1st  ', args.cursor);
      console.log('CursorQuery EMPTY ', cursorQuery);

      if (args.cursor) {
        cursorQuery = { cursor: { $lt: args.cursor } };
        console.log('If statement - CursorQuery...  ', cursorQuery);
        console.log('If statement - Cursor', cursor);
      }

      let notes = await Note.find(cursorQuery)
        .sort({ _id: -1 })
        .limit(limit + 1);

      if (notes.length > limit) {
        hasNextPage = true;
        notes = notes.slice(0, -1);
      }

      const newCursor = notes[notes.length - 1]._id;

      console.log('NewCursor ', newCursor);

      console.log('Notes... ', notes);

      return {
        notes: User.populate(notes, { path: 'author' }),
        cursor: newCursor,
        hasNextPage,
      };
    },
  },
  Mutation: {
    // WORKS
    newNote: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to create a note');
      }
      return await Note.create({
        content: args.content,
        author: Mongoose.Types.ObjectId(context.user._id),
      });
    },
    // WORKS
    deleteNote: async (parent, { id }, { User }) => {
      if (User) {
        throw new AuthenticationError('You must be logged in to delete a note');
      }
      const note = await Note.findByIdAndDelete(id);
      if (note && String(note.author) !== User.id) {
        throw new AuthenticationError(
          'You do not have permisson to delete this note'
        );
      }

      try {
        await note.remove('Deleted');
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    // WORKS
    updateNote: async (parent, { id, content }, { User }) => {
      if (User) {
        throw new AuthenticationError('You must be logged in to delete a note');
      }

      const note = await Note.findById(Note.id);

      if (note && String(note.author) !== User.id) {
        throw new AuthenticationError(
          'You do not have permisson to delete this note'
        );
      }
      return await Note.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            content,
          },
        },
        {
          new: true,
        }
      );
    },
    // WORKS
    signUp: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      console.log(user + ' You have successfully signed up!');

      return { token, user };
    },

    // WORKS
    signIn: async (parent, { email, username, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      console.log(token + ' You have successfully signed in!');

      return { token, user };
    },

    // WORKS
    toggleFavorite: async (parent, { id, _id }, context) => {
      if (context.user) {
        console.log('User is Logged in ' + context.user._id);
        // throw new AuthenticationError();

        let noteCheck = await Note.findById(id);
        console.log('Post ID is ' + noteCheck);
        const hasUser = noteCheck.favoritedBy.indexOf(context.user._id);
        console.log('User ID is ' + context.user._id);

        if (hasUser >= 0) {
          return await Note.findByIdAndUpdate(
            id,
            {
              $pull: {
                favoritedBy: Mongoose.Types.ObjectId(context.user._id),
              },
              $inc: {
                favoriteCount: 1,
              },
            },
            console.log(
              'STEP 1 - User ID is ' + hasUser + ' ' + context.user._id
            ),
            console.log('STEP 1 - Post ID is ' + id),
            {
              new: true,
            }
          );
        } else if (hasUser < 0) {
          return await Note.findByIdAndUpdate(
            id,
            {
              $push: {
                favoritedBy: Mongoose.Types.ObjectId(context.user._id),
              },
              $inc: {
                favoriteCount: 1,
              },
            },
            console.log(
              'STEP 2 - User ID is ' + hasUser + ' ' + context.user._id
            ),
            console.log('STEP 2 - Post ID is ' + id),
            {
              new: true,
            }
          );
        }
      } else {
        throw new AuthenticationError("You aren't logged in!");
      }
    },

    // BELOW IS THE END OF THE CODE
  },
};

module.exports = resolvers;
