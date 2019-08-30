const { createTestClient } = require('apollo-server-testing');
const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { ApolloServer } = require('apollo-server-express');
const { app } = require('../../api/server');
const UserAPI = require('../../datasources/user');
const typeDefs = require('../../schema');
const resolver = require('../user');
const models = require('../../database/models');

describe('Google Authenticated User', () => {
  const dataSources = () => ({
    User: new UserAPI()
  });

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    typeDefs,
    resolver,
    context: async () => {
      return { app, models };
    },
    dataSources,
    introspection: true
  });
  server.applyMiddleware({ app });
  const { mutate } = createTestClient(server);
  const profile = {
    displayName: 'Pascal Ulor',
    familyName: undefined,
    givenName: undefined,
    emails: [{ value: 'emex360@gmail.com', verified: true }],
    id: '107073649484017852354'
  };
  it('should get resolver methods', async () => {
    expect(dataSources().User).toBeInstanceOf(UserAPI);
    expect(dataSources().User.GoogleUser()).toBeDefined();
  });
  it('User should get an error message if no user profile is retrieved from google', async () => {
    const newUser = await resolver.Mutation.authGoogle(null, null, {
      dataSources: { User: dataSources().User, app },
      app
    });
    const error = new AuthenticationError('Google Authentication Failed');
    expect(newUser).toMatchObject(error);
  });
});
