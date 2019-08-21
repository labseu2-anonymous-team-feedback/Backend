module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },

  Mutation: {
    async createNewSurvey(root, args, { dataSources: { Survey }, user }) {
      if (!user) {
        throw new Error('Unauthorized Request, you must log in to create a survey');
      }
      return Survey.createSurvey(args);
    },
  },
  Survey: {
    owner(survey) {
      return survey.getOwner();
    },
  },
};
