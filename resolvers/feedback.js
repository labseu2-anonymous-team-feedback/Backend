const { combineResolvers } = require('graphql-resolvers');
const { validateFeedback } = require('../validations');
const { isAuthenticated, isSurveyOwner } = require('../midlewares/auth');

module.exports = {
  Query: {
    getSurveyFeedback: combineResolvers(
      isAuthenticated,
      isSurveyOwner,
      async (_, { surveyId }, { dataSources: { Feedback } }) => {
        const feedback = await Feedback.getFeedback(surveyId);
        return feedback;
      }
    )
  },

  Mutation: {
    saveFeedback: combineResolvers(
      // validateFeedback,
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
  }
};
