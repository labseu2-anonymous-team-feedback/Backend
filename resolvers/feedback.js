const { combineResolvers } = require('graphql-resolvers');
const { validateFeedback } = require('../validations');
const { isAuthenticated, refuseSurveyOwner, isSurveyOwner } = require('../midlewares/auth');

module.exports = {
  Query: {
    getSurveyFeedback: combineResolvers(
      isAuthenticated,
      // isSurveyOwner,
      async (_, { surveyId }, { dataSources: { Feedback } }) => {
        const feedback = await Feedback.getFeedback(surveyId);
        return feedback;
      }
    )
  },

  Mutation: {
    saveFeedback: combineResolvers(
      validateFeedback,
      refuseSurveyOwner,
      async (_, feedbackData, { dataSources: { Feedback } }) => {
        const feedback = await Feedback.createFeedback(feedbackData.input);
        if (feedback) {
          return {
            message: 'Feedback received, thank you!'
          };
        }
        return {
          message: 'failed'
        };
      }
    )
  },
  Feedback: {
    question(feedback) {
      return feedback.getQuestion();
    },
    survey(feedback) {
      return feedback.getSurvey();
    }
  }
};
