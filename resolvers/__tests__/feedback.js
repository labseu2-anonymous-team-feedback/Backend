const { AuthenticationError } = require('apollo-server-express');
const resolver = require('../feedback');

describe('Feedback Resolver', () => {
  const authMockContext = {
    dataSources: {
      Feedback: {
        getSurveyFeedback: jest.fn(),
        getFeedback: jest.fn(),
        saveFeedback: jest.fn(),
        createFeedback: jest.fn()
      }
    },
    user: {
      id: '089de619-981c-45ca-adec-0d814bac03a9'
    }
  };
  const unAuthMockContext = {
    dataSources: {
      Feedback: {
        getSurveyFeedback: jest.fn(),
        getFeedback: jest.fn(),
        saveFeedback: jest.fn(),
        createFeedback: jest.fn()
      }
    },
    user: null
  };
  const { Feedback } = authMockContext.dataSources;
  const { getSurveyFeedback, saveFeedback } = Feedback;

  it('should get feedback survey', async () => {
    const args = {
      surveyId: 'xx12i21'
    };
    getSurveyFeedback.mockReturnValueOnce({
      surveyId: 'xx12i21',
      comment: 'Not today',
      rating: '4'
    });

    const res = await resolver.Query.getSurveyFeedback(
      null,
      args,
      authMockContext
    );

    expect(res).toEqual(undefined);
  });

  it('should create new survey if user is authenticated', async () => {
    const saveFeedbackResponse = {
      message: 'failed'
    };
    saveFeedback.mockReturnValueOnce(saveFeedbackResponse);
    const args = {
      input: {
        responses: [
          {
            surveyId: 'kljfc1336d3',
            questionId: 'ad467a06',
            rating: null,
            comment: 'Why me'
          }
        ]
      }
    };
    const res = await resolver.Mutation.saveFeedback(
      null,
      args,
      authMockContext
    );
    expect(res).toEqual(saveFeedbackResponse);
  });
});
