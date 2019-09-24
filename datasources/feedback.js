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
    const survey = await this.models.Survey.findOne({
      where: { id: surveyId }
    });
    return survey;
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
      const feedbackResponses = feedbackInput.responses.map(resp => ({
        ...resp,
        userId: feedbackInput.userId,
        surveyId: feedbackInput.surveyId
      }));
      console.log("\n\n\n\n\n");  
      console.log("Before", feedbackResponses);  
      console.log("\n\n\n\n\n");  
      
      const result = await this.models.Feedback.bulkCreate(feedbackResponses);
      console.log("\n\n\n\n\n");  
      console.log(result);  
      console.log("\n\n\n\n\n");  
      return result;
    } else {
      throw new UserInputError('Please provide all required feedback data');
    }
  }
}

module.exports = Feedback;
