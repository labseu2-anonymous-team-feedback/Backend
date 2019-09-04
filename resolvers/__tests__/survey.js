const { AuthenticationError } = require('apollo-server-express');
const resolver = require('../survey');

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
  it('should return user surveys', async () => {
    const res = await resolver.Query.getUserSurveys(
      null,
      null,
      authMockContext
    );
    expect(res).toEqual([{ id: '089de619-981c' }, { id: '089de619-981c43' }]);
  });
  it('should fail if unauthorized user tries to get surveys', async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await resolver.Query.getUserSurveys(
        null,
        null,
        unAuthMockContext
      );
    } catch (error) {
      expect(error).toEqual(
        new AuthenticationError('Unauthorized Request, Authentication required')
      );
    }
  });

  const newSurvey = {
    title: 'test',
    userId: '089de619-981c-45ca-adec-0d814bac03a9'
  };
  createSurvey.mockReturnValueOnce({ dataValues: newSurvey });
  it('should create new survey if user is authenticated', async () => {
    const args = {
      input: {
        title: 'test survey',
        questions: [
          {
            question: 'question 1'
          }
        ]
      }
    };
    const res = await resolver.Mutation.createNewSurvey(
      null,
      args,
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
        new AuthenticationError('Unauthorized Request, Authentication required')
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
  it('should should get survey questions', async () => {
    const Fn = jest.fn();
    const survey = new Fn();
    survey.getQuestions = jest.fn();
    survey.getQuestions.mockReturnValueOnce([
      { id: '089de619-981c43', question: 'what is test' }
    ]);
    const res = await resolver.Survey.questions(survey);
    expect(res).toEqual([{ id: '089de619-981c43', question: 'what is test' }]);
  });

  it("should should get a question's survey", async () => {
    const Fn = jest.fn();
    const question = new Fn();
    question.getSurvey = jest.fn();
    question.getSurvey.mockReturnValueOnce({
      id: '089de619-981c43',
      title: 'test survey'
    });
    const res = await resolver.Question.survey(question);
    expect(res).toEqual({
      id: '089de619-981c43',
      title: 'test survey'
    });
  });
});
