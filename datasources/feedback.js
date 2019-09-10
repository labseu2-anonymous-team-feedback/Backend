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
    if (feedbackInput && feedbackInput.responses && feedbackInput.surveyId) {
      const survey = await this.models.Survey.findOne({
        where: {
          id: feedbackInput.surveyId
        }
      });
      if (!survey) {
        throw new UserInputError('Survey with that Id does not exist');
      }
    } else {
      throw new UserInputError('Please provide all required feedback data');
    }

    const feedbackResponses = feedbackInput.responses.map(resp => ({
      ...resp,
      userId: feedbackInput.userId,
      surveyId: feedbackInput.surveyId
    }));
    const result = await this.models.Feedback.bulkCreate(feedbackResponses);
    return result;
  }
}

module.exports = Feedback;
