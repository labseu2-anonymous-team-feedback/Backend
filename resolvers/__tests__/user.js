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

  const { User } = mockContext.dataSources;
  const { getAllUsers, createAccount, userLogin } = User;
  it('should get All users', async () => {
    getAllUsers.mockReturnValueOnce([
      { id: '089de619-981c43', username: 'tester' }
    ]);
    const res = await resolver.Query.getAllUsers(null, null, mockContext);
    expect(res).toEqual([{ id: '089de619-981c43', username: 'tester' }]);
    expect(getAllUsers).toBeCalledTimes(1);
  });
  it('should should get user surveys', async () => {
    const Fn = jest.fn();
    const user = new Fn();
    user.getSurveys = jest.fn();
    user.getSurveys.mockReturnValueOnce([{ title: 'test survey' }]);
    const res = await resolver.User.surveys(user);
    expect(res).toEqual([{ title: 'test survey' }]);
  });
});
