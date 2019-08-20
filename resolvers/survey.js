module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },

  Mutation: {
    async createNewSurvey(root, args, { title, userId }, { models }) {
      return models.Survey.create({
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
