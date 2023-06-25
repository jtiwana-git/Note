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
const auth = require('../utils/auth.js');

const resolvers = {
  Query: {
    // Get the current user
    me: async (parent, args, context) => {
      return await User.findById(context.user._id);
    },

    // Find user by username
    user: async (parent, { username }) => {
      return await User.findOne({ username });
    },

    // Find all users
    users: async () => {
      return await User.find().limit(100);
    },

    // Find note by note ID with author info
    note: async (parent, args, context) => {
      const note = await Note.findById(args.id).populate('author');
      console.log('Note: ' + note);
      return note;
    },

    // Find all notes with author info
    notes: async (parent, args, context) => {
      return await Note.find({
        author: context.user._id || context.user.username,
      }).populate('author');
    },

    // Resolve the author info for a note when requested
    author: async (author, args, context) => {
      const user = await User.findById({
        author: Note.author,
        _id: context.user._id || context.user.username,
      });
      console.log('Author: ' + user);
      return user;
    },

    // Resolve the list of favorites for a user when requested

    favorites: async (parent, context) => {
      const fav = Note.find({
        favoritedBy: context.user._id,
        _id: context.user._id || context.user.username,
      }).sort({
        _id: -1,
      });
      console.log('Favorites: ' + fav);

      return fav;
    },

    // Resolved the favoritedBy info for a note when requested
    favoritedBy: async (parent, note, context) => {
      const getFavorite = await User.find({
        _id: { $in: note.favoritedBy },
        favoritedBy: context.user._id || context.user.username,
      });
      console.log('GetFavorite: ' + getFavorite);

      return getFavorite;
    },

    noteFeed: async (parent, args, { cursor }, author, context) => {},
  },
  Mutation: {
    // Create an account
    signUp: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log(user + ' Created account and the token ID  ' + token);
      return { token, user };
    },

    // Sign in to an account
    signIn: async (parent, { username, email, password }) => {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user) {
        throw new AuthenticationError('Cannot find the credentials');
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password/credentials');
      }
      const token = signToken(user);
      console.log(user + ' Signed in and the token ID  ' + token);
      return { token, user };
    },

    // add new note
    newNote: async (parent, { content }, context) => {
      if (context.user) {
        const note = await Note.create({
          content,
          author: context.user._id || context.user.username,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { notes: note._id } }
        );
        return note;
      }
    },

    // Delete a note (CHECK!! - Any users can delete notes - TO FIX!!)
    deleteNote: async (_, { id, author }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          'You need to be signed in! to delete a note'
        );
      }

      const note = await Note.findById(id);
      console.log('Find note -  ' + note);
      if (note && String(author) === context.user) {
        console.error('Check! -  ' + note);
        throw new AuthenticationError(
          'You do not have permission to delete this note'
        );
      }
      try {
        await note.remove();
        return true;
      } catch (error) {
        return false;
      }
    },

    // Update a note (CHECK!! - Any users can update notes - TO FIX!!)
    updateNote: async (parent, { id, content }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          'You need to be signed in! to update a note'
        );
      }

      const noteUpdate = await Note.findById(id);
      console.log('Find note -  ' + noteUpdate);

      if (noteUpdate && String(noteUpdate.author) === context.user.id) {
        throw new AuthenticationError(
          'You do not have permission to update this note'
        );
      }
      console.log('Check! -  ' + noteUpdate);

      return await Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
        { new: true }
      );
    },

    // Favorite a note - TO BE SORTED (On GraphQL Playground works with ID, content, Favourite Count but not with favoritedBy) - 14/05/2023

    toggleFavorite: async (username, { id }, context) => {
      if (!context.user) {
        console.log('User is Logged in ' + context.user);
        throw new AuthenticationError();
      }

      // WORKS on 13/05/2023
      let noteChecked = await Note.findById(id);
      console.log('Checked NOTE ' + noteChecked);

      let hasUser = noteChecked.favoritedBy.indexOf(
        context.user._id || username
      );
      console.log('Index of ' + hasUser);

      if (hasUser >= 0) {
        console.log('Remove User ' + context.user.username);
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
          },
          console.log('Add fav User (+1) - ' + context.user.username)
        );
      }
    },
  },
};

module.exports = resolvers;
