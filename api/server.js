const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const models = require('../database/models');
const LoginAPI = require('../data/user');


const app = express();

const dataSources = () => ({
  User: new LoginAPI(),
});

const context = { models };

const server = new ApolloServer({
  typeDefs, resolvers, context, dataSources, introspection: true,
});

server.applyMiddleware({ app });

module.exports = {
  app,
  graphqlPath: server.graphqlPath,
};
