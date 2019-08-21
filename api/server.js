const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const models = require('../database/models');

const app = express();
const context = { models };


const server = new ApolloServer({
  typeDefs, resolvers, context,
});

server.applyMiddleware({ app });

module.exports = {
  app,
  graphqlPath: server.graphqlPath,
};
