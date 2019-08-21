const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../schema");
const resolvers = require("../resolvers");
const models = require("../database/models");
const UserAPI = require("../datasources/user");
const SurveyAPI = require("../datasources/survey");
const { verifyUserToken } = require("../helpers/token");

const app = express();

const dataSources = () => ({
  User: new UserAPI(),
  Survey: new SurveyAPI()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = (req.headers && req.headers.authorization) || "";
    const user = await verifyUserToken(token);
    return {
      models,
      user
    };
  },
  dataSources,
  introspection: true,
  playground: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  }
});

server.applyMiddleware({ app });

module.exports = {
  app,
  graphqlPath: server.graphqlPath
};
