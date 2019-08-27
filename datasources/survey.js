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

  async createSurvey(surveyData, userId) {
    const { title, questions } = surveyData;
    const newSurvey = await this.models.Survey.create(
      {
        userId,
        title,
        questions
      },
      {
        include: [
          {
            model: this.models.Question,
            as: 'questions'
          }
        ]
      }
    );
    return newSurvey.get({ plain: true });
  }

  async getUserSurveys(userId) {
    const surveys = this.models.Survey.findAll({ where: { userId } });
    return surveys;
  }
}

module.exports = Survey;
