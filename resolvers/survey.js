module.exports = {
  Query: {
    async getAllSurveys(root, args, { models }) {
      const surveys = await models.Survey.findAll();
      return surveys;
    },
  },
  Survey: {
    owner(survey) {
      return survey.getOwner();
    },
  },
};
