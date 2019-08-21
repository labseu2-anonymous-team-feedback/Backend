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
    async createNewSurvey(
      root,
      args,
      {
        dataSources: { Survey },
        user
      }
    ) {
      if (!user) {
        throw new Error(
          'Unauthorized Request, you must log in to create a survey'
        );
      }
      return Survey.createSurvey({ title: args.title, userId: user.id });
    }
  },
  Survey: {
    owner(survey) {
      return survey.getOwner();
    }
  }
};
