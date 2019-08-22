const resolver = require('../survey');

describe('test setup', () => {
  it('should return true', () => {
    expect(true).toBe(true);
  });
});

describe('Survey Resolver', () => {
  const authMockContext = {
    dataSources: {
      Survey: {
        getUserSurveys: jest.fn(),
        createSurvey: jest.fn()
      }
    },
    user: {
      id: '089de619-981c-45ca-adec-0d814bac03a9'
    }
  };
  const unAuthMockContext = {
    dataSources: {
      Survey: {
        getUserSurveys: jest.fn(),
        createSurvey: jest.fn()
      }
    },
    user: null
  };
  const { Survey } = authMockContext.dataSources;
  const { getUserSurveys, createSurvey } = Survey;

  getUserSurveys.mockReturnValueOnce([
    { id: '089de619-981c' },
    { id: '089de619-981c43' }
  ]);
  it('should return users surveys', async () => {
    const res = await resolver.Query.getUserSurveys(
      null,
      null,
      authMockContext
    );
    expect(res).toEqual([{ id: '089de619-981c' }, { id: '089de619-981c43' }]);
  });
  it('should fail if unauthorized user tries to get surveys', async () => {
    try {
      const res = await resolver.Query.getUserSurveys(
        null,
        null,
        unAuthMockContext
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized Request'));
    }
  });

  const newSurvey = {
    title: 'test',
    userId: '089de619-981c-45ca-adec-0d814bac03a9'
  };
  createSurvey.mockReturnValueOnce({ dataValues: newSurvey });
  it('should create new survey if user is authenticated', async () => {
    const res = await resolver.Mutation.createNewSurvey(
      null,
      { title: 'test' },
      authMockContext
    );
    expect(res.dataValues).toEqual(newSurvey);
  });
  it('should fail if unauthenticated user tries to create survey', async () => {
    try {
      const res = await resolver.Mutation.createNewSurvey(
        null,
        { title: 'test' },
        unAuthMockContext
      );
      expect(res.dataValues).toEqual(newSurvey);
    } catch (error) {
      expect(error).toEqual(
        new Error('Unauthorized Request, you must log in to create a survey')
      );
    }
  });
  it('should should get survey owner', async () => {
    const Fn = jest.fn();
    const survey = new Fn();
    survey.getOwner = jest.fn();
    survey.getOwner.mockReturnValueOnce({ name: 'tester' });
    const res = await resolver.Survey.owner(survey);
    expect(res).toEqual({ name: 'tester' });
  });
});
