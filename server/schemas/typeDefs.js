const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime

  type User {
    _id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note]!
    favorites: String
  }

  type Note {
    _id: ID!
    content: String!
    author: String
    favoriteCount: Int
    favoritedBy: [User]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    me: User
    notes: [Note]!
    note(id: ID): Note!
    user(username: String!): User
    users: [User!]!
    author(id: ID!): User
    noteFeed(cursor: String): NoteFeed
    favoritedBy: [User]
    favorites: [Note!]!
  }
  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    newNote(content: String!): Note
    updateNote(id: ID!, content: String!): Note
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): Auth
    signIn(username: String, email: String, password: String!): Auth
    toggleFavorite(id: ID!): Note!
  }
`;

module.exports = typeDefs;
