const { combineResolvers } = require('graphql-resolvers');
const { validateSurvey } = require('../validations');

module.exports = {
  Query: {
    async getUserSurveys(
      root,
      args,
      {
        dataSources: { Survey },
        user
      }
    ) {
      if (!user) {
        throw new Error('Unauthorized Request');
      }
      const surveys = await Survey.getUserSurveys(user.id);
      return surveys;
    }
  },

  Mutation: {
    createNewSurvey: combineResolvers(
      validateSurvey,
      async (_, surveyData, { dataSources: { Survey }, user }) => {
        if (!user) {
          throw new Error(
            'Unauthorized Request, you must log in to create a survey'
          );
        }
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
    }
  }
};
