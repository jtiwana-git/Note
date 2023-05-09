const { User, Note } = require('../models');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/auth.js');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../utils/gravatar.js');
const Mongoose = require('mongoose');
const { insertMany } = require('../models/Note');
const { populate } = require('../models/User');
const { default: mongoose } = require('mongoose');

const resolvers = {
  Query: {
    // Find a user by username (worked on 07/05/2023)
    user: async (parent, { username }) => {
      return await User.findOne({ username });
    },

    // Find all users (worked on 07/05/2023)
    users: async () => {
      return await User.find({});
    },

    // Find the current user given the context (worked on 07/05/2023 for user information (id,username, email, avatar)

    me: async (parent, args, context) => {
      return await User.findOne({ _id: context.user._id });
    },

    // Find a note by ID (WORKED ON 08/05/2023 (GraphQL Playground - ID and content for Note and ID and username for User (author)))
    note: async (parent, args) => {
      return await Note.findById(args.id).populate('author');
    },

    // Get all notes (Worked on 08/05/2023)
    notes: async (parent, args, context) => {
      const allNotes = await Note.find({ author: context.user._id });
      console.log('All Notes: ' + allNotes);
      return allNotes;
    },

    // Resolve the author info for a note when requested (??)
    author: async (parent, args, context) => {
      console.log('Author: ' + Note.author);
      return await User.findById(Note.author);
    },

    // Resolve the favoritedBy info for a note when requested - TO BE SORTED (NOT WORKING)
    // favoritedBy: async (_, args, id) => {
    //   const userBy =
    //   await User.find({
    //     user_id: { $in: Note.favoritedBy },
    //   });
    //   console.log('Favorited By: ' + userBy);
    //   return userBy;
    // },

    // copied from PDF (Book) ->

    favoritedBy: async (note, args, { models }) => {
      return await models.User.find({ _id: { $in: note.favoritedBy } });
    },

    // Resolve the list of favorited notes for a user when requested - WORKING
    favorites: async (parent, { user_id }, context) => {
      const fav = Note.find({ favoritedBy: context.user._id });
      console.log('Favorites: ' + fav);

      return fav;
    },
    noteFeed: async (parent, args, { cursor, username }, context) => {
      // Set the default limit to 10 (as a text the limit is ??????)
      const limit = 2;

      // set the default hasNextPage value to false
      let hasNextPage = false;

      // if no cursor is passed the default query will be empty
      // this will pull the newest notes from the db
      let cursorQuery = {};
      console.log('Line 80 - EMPTY Cursor: ' + cursorQuery);

      // if there is a cursor
      // our query will look for notes with an ObjectId less than that of the cursor
      if (cursor) {
        cursorQuery = { _id: { $lt: args.cursor } };
      }
      console.log('Line 87 - Cursor: ' + cursorQuery);

      // find the limit + 1 of notes in our db, sorted newest to oldest
      let notes = await Note.find(cursorQuery)
        .sort({ _id: -1 })
        .limit(limit + 1);
      console.log('Line 93 - Notes: ' + notes);

      // if the number of notes we find exceeds our limit
      // set hasNextPage to true & trim the notes to the limit
      if (notes.length > limit) {
        hasNextPage = true;
        notes = notes.slice(0, -1);
      }

      // the new cursor will be the Mongo ObjectID of the last item in the feed array
      const newCursor = notes[notes.length - 1]._id;

      console.log('Line 105 - Last item in array feed: ' + newCursor);

      return {
        notes,
        cursor: newCursor,
        hasNextPage,
      };
    },
  },
  Mutation: {
    // Create a user
    signUp: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      console.log(user + ' You have successfully created an account!');

      return { token, user };
    },

    // Login a user (works on 7/05/2023)
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

    // Create a note (works on 7/05/2023)
    newNote: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to create a note');
      }
      console.log('Note created by ' + context.user.username);
      console.log('Note created by Author ID ' + context.user._id);
      return await Note.create({
        content: args.content,
        author: Mongoose.Types.ObjectId(context.user._id),
      });
    },

    // Delete a note (works on 7/05/2023)
    deleteNote: async (parent, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to delete a note');
      }
      const deleteNote = await Note.findByIdAndRemove(id);
      if (deleteNote && String(deleteNote.author) !== context.user._id) {
        throw new AuthenticationError(
          'You do not have permission to delete this note'
        );
      }
      try {
        await deleteNote.remove('Deleted note');
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    // Update a note (works on 7/05/2023)
    updateNote: async (parent, { id, content }, { User }) => {
      if (User) {
        throw new AuthenticationError('You must be logged in to delete a note');
      }

      const noteUpdate = await Note.findById(Note.id);

      if (noteUpdate && String(noteUpdate.author) !== User.id) {
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

    // Favorite a note - - TO BE SORTED (NOT WORKING)

    toggleFavorite: async (parent, { id, user }, context) => {
      if (!context.user._id) {
        console.log('User is Logged in ' + context.user._id);
        throw new AuthenticationError();
      }

      let noteCheck = await Note.findById(id);
      console.log('NOTE CHECK ' + noteCheck);

      const hasUser = noteCheck.favoritedBy.indexOf(context.user._id);
      console.log('Index of...... ' + hasUser);

      if (hasUser >= 0) {
        console.log('Remove User ' + hasUser);
        return await Note.findByIdAndUpdate(
          id,
          {
            $pull: {
              favoritedBy: mongoose.Types.ObjectId(context.user._id),
            },
            $inc: {
              favoriteCount: -1,
            },
          },

          {
            new: true,
          }
        );
      } else {
        console.log('Add fav User ' + hasUser);
        return await Note.findByIdAndUpdate(
          id,
          {
            $push: {
              favoritedBy: mongoose.Types.ObjectId(context.user._id),
            },
            $inc: {
              favoriteCount: 1,
            },
          },
          {
            new: true,
          }
        );
      }
    },
  },
};

module.exports = resolvers;
