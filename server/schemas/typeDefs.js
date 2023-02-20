const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    notes: [Note]
    note(id: ID): Note
    user(username: String!): User
    users: [User!]
    me: User!
    noteFeed(cursor: String): NoteFeed
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
    signIn(username: String!, email: String!, password: String!): Auth
    toggleFavorite(id: ID!): Note!
  }
`;

module.exports = typeDefs;
