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
    // Current User information
    me: async (_, args, context) => {
      const myself = User.findById(context.user._id);
      console.log('My information ' + myself);
      return myself;
    },

    // Find user by Username
    user: async (_, args) => {
      const username = User.findOne({ username: args.username });
      console.log('Username is ' + username);
      return username;
    },

    // All users
    users: async () => {
      const allUsers = User.find({}).limit(100);
      console.log('All Users ' + allUsers);
      return allUsers;
    },

    // Resolve the author information for a note when requested
    author: async (_, _id, context) => {
      let writer = User.findById(context.user._id).populate(Note.author);

      return writer;
    },

    // Find a note
    note: async (_, args) => {
      const aNote = Note.findById(args.id).populate('author');
      console.log('A note ' + aNote);
      return aNote;
    },
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
    newNote: async (_, args, _id, user, content, context) => {},
  },
};

//     // Find all notes with author info
//     notes: async (parent, args, context) => {
//       return await Note.find({
//         author: context.user._id || context.user.username,
//       }).populate('author');
//     },

//     // Resolve the author info for a note when requested
//     author: async (author, args, context) => {
//       const user = await User.findById({
//         author: User.username,
//         _id: context.user._id || context.user.username,
//       });
//       console.log('Author: ' + user);
//       return user;
//     },

//     favorites: async (parent, _id, context) => {
//       const favorites = Note.find({
//         favoritedBy: context.user._id,
//       })
//         .sort({ _id: -1 })
//         .populate('author');
//       console.log('Favorites: ' + favorites);

//       return favorites;
//     },

//     // Resolved the favoritedBy info for a note when requested
//     favoritedBy: async (parent, note, _id, context) => {
//       const getFavorite = await User.find({
//         user_id: { $in: Note.favoritedBy },
//       });
//       console.log('GetFavorite: ' + getFavorite);

//       return getFavorite;
//     },

//     noteFeed: async (parent, { cursor }, context) => {
//       // hard code the limit to 100 items
//       const limit = 100;

//       // set the default hasNextPage value to false
//       let hasNextPage = false;

//       // if no cursor is passed the default query will be empty
//       // this will pull the newest notes from the db
//       let cursorQuery = {};

//       // if there is a cursor
//       // our query will look for notes with an ObjectId less than that of the cursor
//       if (cursor) {
//         cursorQuery = { _id: { $lt: cursor } };
//       }
//       console.log('if there is a cursor: ' + cursor);

//       let allNotes = await Note.find({
//         // author: context.user._id || context.user.username,
//       });
//       console.log('All Notes: ' + allNotes);

//       // find the limit + 1 of notes in our db, sorted newest to oldest
//       allNotes = Note.find(cursorQuery)
//         .sort({ _id: -1 })
//         .limit(limit + 1);

//       // if the number of notes we find exceeds our limit
//       // set hasNextPage to true & trim the notes to the limit
//       if (allNotes.length > limit) {
//         hasNextPage = true;
//         allNotes = allNotes.slice(0, -1);
//       }

//       // the new cursor will be the Mongo ObjectID of the last item in the feed array
//       const newCursor = allNotes[allNotes.length - 1];

//       return {
//         allNotes,
//         cursor: newCursor,
//         hasNextPage,
//       };
//     },
//   },
//   Mutation: {
//
//     // add new note
//     newNote: async (parent, { content }, context) => {
//       if (!context.user) {
//         throw new AuthenticationError('You need to be signed in!');
//       }

//       const addNote = await Note.create({
//         content: context.content,
//         author: context.user.username,
//         favoriteCount: 0,
//       });
//       console.log('New Note: ' + addNote);
//       return addNote;
//     },

//     // Delete a note (CHECK!! - Any users can delete notes - TO FIX!!)
//     deleteNote: async (_, { id, author }, context) => {
//       if (!context.user) {
//         throw new AuthenticationError(
//           'You need to be signed in! to delete a note'
//         );
//       }

//       const note = await Note.findById(id);
//       console.log('Find note -  ' + note);
//       if (note && String(author) === context.user) {
//         console.error('Check! -  ' + note);
//         throw new AuthenticationError(
//           'You do not have permission to delete this note'
//         );
//       }
//       try {
//         await note.remove();
//         return true;
//       } catch (error) {
//         return false;
//       }
//     },

//     // Update a note (CHECK!! - Any users can update notes - TO FIX!!)
//     updateNote: async (parent, { id, content }, context) => {
//       if (!context.user) {
//         throw new AuthenticationError(
//           'You need to be signed in! to update a note'
//         );
//       }

//       const noteUpdate = await Note.findById(id);
//       console.log('Find note -  ' + noteUpdate);

//       if (noteUpdate && String(noteUpdate.author) === context.user.id) {
//         throw new AuthenticationError(
//           'You do not have permission to update this note'
//         );
//       }
//       console.log('Check! -  ' + noteUpdate);

//       return await Note.findOneAndUpdate(
//         { _id: id },
//         { $set: { content } },
//         { new: true }
//       );
//     },

//     // Favorite a note - TO BE SORTED

//     toggleFavorite: async (_, { id }, context) => {
//       if (!context.user) {
//         console.log('User is Logged in ' + context.user);
//         throw new AuthenticationError();
//       }

//       // WORKS on 13/05/2023
//       let noteChecked = await Note.findById(id);
//       console.log('Checked NOTE ' + noteChecked);

//       let hasUser = noteChecked.favoritedBy.indexOf(
//         context.user._id || username
//       );
//       console.log('Index of ' + hasUser);
//       if (hasUser >= 0) {
//         console.log('Remove User ' + context.user._id || username);
//         return await Note.findByIdAndUpdate(
//           id,

//           {
//             $pull: {
//               favoritedBy: context.user._id,
//             },
//             $inc: {
//               favoriteCount: -1,
//             },
//           },

//           {
//             new: true,
//           }
//         );
//       } else {
//         return await Note.findByIdAndUpdate(
//           id,
//           {
//             $push: {
//               favoritedBy: context.user._id || username,
//             },

//             $inc: {
//               favoriteCount: 1,
//             },
//           },
//           {
//             new: true,
//           },
//           console.log('Add fav User (+1) - ' + context.user._id || username)
//         );
//       }
//     },
//   },
// };

module.exports = resolvers;
