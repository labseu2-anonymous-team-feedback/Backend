const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');


class Survey extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  async createSurvey(surveyData) {
    return this.models.Survey.create(surveyData);
  }

  async getUserSurveys(userId) {
    const surveys = this.models.Survey.findAll({ where: { userId } });
    return surveys;
  }
}

module.exports = Survey;
