const { createTestClient } = require('apollo-server-testing');
const {
  ApolloServer,
  AuthenticationError,
  ApolloError
} = require('apollo-server-express');
const {
  app,
  server,
  dataSources,
  resolvers,
  typeDefs,
  UserAPI,
  SurveyAPI
} = require('../../api/server');
const { constructTestServer } = require('../__utils__');

describe('Google Authenticated User', () => {
  it('should get google resolver method', async () => {
    const { User, Survey } = constructTestServer({
      context: () => {}
    });
    expect(User).toBeInstanceOf(UserAPI);
    expect(Survey).toBeInstanceOf(SurveyAPI);
    expect(User.GoogleUser()).toBeDefined();
  });
});
