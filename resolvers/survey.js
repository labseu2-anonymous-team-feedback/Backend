module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },

  Mutation: {
    async createNewSurvey(root, args, { models }) {
      console.log(models);
      return models.Survey.create({
        title: args.title,
        userId: args.userId,
      });
    },
  },

  Survey: {
    owner(survey) {
      return survey.getOwner();
    },
  },
};
