const { combineResolvers } = require('graphql-resolvers');
const { validateSurvey } = require('../validations');
const { isAuthenticated } = require('../midlewares/auth');

module.exports = {
  Query: {
    getUserSurveys: combineResolvers(
      isAuthenticated,
      async (_, __, { dataSources: { Survey }, user }) => {
        const surveys = await Survey.getUserSurveys(user.id);
        return surveys;
      }
    ),
    getSurveyDetails: combineResolvers(
      async (_, { surveyId }, { dataSources: { Survey } }) => {
        const questions = await Survey.getSurveyDetails(surveyId);
        return questions;
      }
    ),
    getSurveyFeedback: combineResolvers(
      isAuthenticated,
      async (_, { surveyId }, { dataSources: { Survey } }) => {
        const feedback = await Survey.getSurveyFeedback(surveyId);
        return feedback;
      }
    )
  },

  Mutation: {
    createNewSurvey: combineResolvers(
      isAuthenticated,
      validateSurvey,
      async (_, surveyData, { dataSources: { Survey }, user }) => {
        return Survey.createSurvey(surveyData.input, user.id);
      }
    )
  },
  Survey: {
    owner(survey) {
      return survey.getOwner();
    },
    questions(survey) {
      return survey.getQuestions();
    }
  },
  Question: {
    survey(question) {
      return question.getSurvey();
    },
    feedbacks(question) {
      return question.getFeedbacks();
    }
  }
};
