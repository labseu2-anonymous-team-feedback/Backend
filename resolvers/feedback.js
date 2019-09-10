const { combineResolvers } = require('graphql-resolvers');
const { validateFeedback } = require('../validations');
const { isAuthenticated } = require('../midlewares/auth');

module.exports = {
  Query: {
    getSurveyFeedback: combineResolvers(
      isAuthenticated,
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
  },
  Feedback: {
    author(feedback) {
      return feedback.getAuthor();
    },
    question(feedback) {
      return feedback.getQuestion();
    },
    survey(feedback) {
      return feedback.getSurvey();
    }
  }
};
