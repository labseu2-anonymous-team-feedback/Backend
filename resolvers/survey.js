module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },

  Mutation: {
    async createNewSurvey(root, args, { dataSources: { Survey } }) {
      return Survey.createSurvey(args);
    },
  },
  Survey: {
    owner(survey) {
      return survey.getOwner();
    },
  },
};
