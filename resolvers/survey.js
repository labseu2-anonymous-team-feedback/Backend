module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },

  Mutation: {
    async createNewSurvey(_, { title, userId }, { models }) {
      return models.Survey({
        title,
        userId,
      });
    },
  },

  Survey: {
    surveys(survey) {
      return survey.getSurveys();
    },
    owner(survey) {
      return survey.getOwner();
    },
  },
};
