const resolver = require('../user');

describe('User Resolver', () => {
  const mockContext = {
    dataSources: {
      User: {
        getAllUsers: jest.fn(),
        createAccount: jest.fn(),
        userLogin: jest.fn()
      }
    }
  };
});
