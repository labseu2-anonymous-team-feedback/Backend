const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { UserInputError } = require('apollo-server-express');

class Feedback extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  async getFeedback(surveyId) {
    const feedback = await this.models.Feedback.findAll({
      where: { surveyId }
    });
    return feedback;
  }

  async createFeedback(feedbackInput) {
    if (
      feedbackInput &&
      feedbackInput.responses &&
      feedbackInput.responses[0].surveyId
    ) {
      const survey = await this.models.Survey.findOne({
        where: {
          id: feedbackInput.responses[0].surveyId
        }
      });
      if (!survey) {
        throw new UserInputError('Survey with that Id does not exist');
      }
    }
    const result = await this.models.Feedback.bulkCreate(
      feedbackInput.responses
    );
    return result;
  }
}

module.exports = Feedback;
