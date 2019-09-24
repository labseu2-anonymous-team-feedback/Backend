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
        surveyId: '4ac2c1ef-2a0f-4f2e-b383-567388461f6c',
        responses: [
          {
            questionId: 'bf26e154-aa84-4a36-9f0e-0262a6ef70ff',
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

  it('should should get get question', async () => {
    const Fn = jest.fn();
    const feedback = new Fn();
    feedback.getQuestion = jest.fn();
    feedback.getQuestion.mockReturnValueOnce({ question: 'How am i doing' });
    const res = await resolver.Feedback.question(feedback);
    expect(res).toEqual({ question: 'How am i doing' });
  });

  it('should should get get survey', async () => {
    const Fn = jest.fn();
    const feedback = new Fn();
    feedback.getSurvey = jest.fn();
    feedback.getSurvey.mockReturnValueOnce({ title: 'Self Check' });
    const res = await resolver.Feedback.survey(feedback);
    expect(res).toEqual({ title: 'Self Check' });
  });
});
