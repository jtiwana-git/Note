const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = { typeDefs, resolvers, DateTime: GraphQLDateTime };
