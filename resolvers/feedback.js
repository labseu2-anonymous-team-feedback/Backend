const { combineResolvers } = require('graphql-resolvers');
const { validateFeedback } = require('../validations');
const { isAuthenticated } = require('../midlewares/auth');

module.exports = {
  Query: {
    getSurveyFeedback: combineResolvers(
      isAuthenticated,
      async (_, { feedbackId }, { dataSources: { Feedback }, user }) => {
        const feedback = await Feedback.getFeedbackSurvey(feedbackId);
        return feedback;
      }
    )
  },

  Mutation: {
    saveFeedback: combineResolvers(
      validateFeedback,
      async (_, feedbackData, { dataSources: { Feedback }, user }) => {
        return Feedback.createFeedback(feedbackData.input);
      }
    )
  }
};
