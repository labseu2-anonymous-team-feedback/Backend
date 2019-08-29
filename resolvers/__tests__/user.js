const { AuthenticationError, ApolloError } = require('apollo-server-express');
const resolver = require('../user');

describe('User Resolver', () => {
  const mockContext = {
    dataSources: {
      User: {
        getAllUsers: jest.fn(),
        createAccount: jest.fn(),
        userLogin: jest.fn(),
        verifyAccount: jest.fn(),
        sendResetPasswordEmail: jest.fn(),
        resetPassword: jest.fn()
      }
    }
  };

  const { User } = mockContext.dataSources;
  const {
    getAllUsers,
    createAccount,
    userLogin,
    verifyAccount,
    sendResetPasswordEmail
  } = User;
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

  it('should create a new user', async () => {
    const userData = {
      username: 'tester',
      email: 'a@a.com',
      password: 'password'
    };
    createAccount.mockReturnValueOnce(userData);
    const res = await resolver.Mutation.createAccount(
      null,
      userData,
      mockContext
    );
    expect(res).toEqual(userData);
    expect(createAccount).toBeCalledTimes(1);
  });

  it('should log in user', async () => {
    const userData = {
      email: 'a@a.com',
      password: 'password'
    };
    userLogin.mockReturnValueOnce({
      email: 'a@a.com',
      token: 'hkajhkhiuiqwixmaa'
    });

    const res = await resolver.Mutation.userLogin(null, userData, mockContext);
    expect(userLogin).toBeCalledTimes(1);
    expect(res).toEqual({
      email: 'a@a.com',
      token: 'hkajhkhiuiqwixmaa'
    });
  });

  it('should throw error if email verification token is invalid', async () => {
    try {
      await resolver.Mutation.verifyAccount(
        null,
        { token: 'hsdgjhhskjhk' },
        mockContext
      );
    } catch (error) {
      expect(error).toEqual(
        new AuthenticationError('Invalid verification link')
      );
    }
  });
  it('should log user in if token in valid', async () => {
    verifyAccount.mockReturnValueOnce({ token: 'jhjhjhassmmn.uyyj.wQ' });
    const res = await resolver.Mutation.verifyAccount(
      null,
      { token: 'hsdgjhhskjhk' },
      mockContext
    );
    expect(res).toEqual({ token: 'jhjhjhassmmn.uyyj.wQ' });
  });
  it('should throw error if user with specified email does not exist', async () => {
    try {
      await resolver.Mutation.sendResetPasswordEmail(
        null,
        { email: 'test@example.com' },
        mockContext
      );
    } catch (error) {
      expect(error).toEqual(
        new ApolloError(
          'The user with the specified email address does not exist'
        )
      );
    }
  });
  it('should send reset password email if user exists', async () => {
    sendResetPasswordEmail.mockReturnValueOnce({ message: 'email sent' });
    const res = await resolver.Mutation.sendResetPasswordEmail(
      null,
      { email: 'test@example.com' },
      mockContext
    );
    expect(res).toEqual({ message: 'email sent' });
  });
});
