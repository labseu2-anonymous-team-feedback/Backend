const { ApolloServer } = require('apollo-server-express');

const {
  app,
  UserAPI,
  SurveyAPI,
  dataSources,
  context: defaultContext,
  typeDefs,
  resolvers
} = require('../api/server');
/**
 * Integration testing utils
 */
const constructTestServer = ({ context = defaultContext } = {}) => {
  const User = new UserAPI();
  const Survey = new SurveyAPI();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      User,
      Survey
    }),
    context,
    introspection: true
  });

  return { server, User, Survey };
};

module.exports.constructTestServer = constructTestServer;
