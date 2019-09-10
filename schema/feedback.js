const { gql } = require('apollo-server-express');

const feedbackTypes = gql`
  type Query {
    getSurveyFeedback(surveyId: String!): [Feedback!]!
  }
  type Feedback {
    id: String
    userId: String
    surveyId: String!
    questionId: String!
    comment: String
    rating: String
  }
  input QuestionFeedback {
    id: String
    userId: String
    questionId: String!
    comment: String
    rating: String
  }

  type Mutation {
    saveFeedback(input: FeedbackInput!): FeedbackResponse!
  }
  input FeedbackInput {
    surveyId: String!
    userId: String
    responses: [QuestionFeedback!]!
  }
  type FeedbackResponse {
    message: String!
  }
`;

module.exports = feedbackTypes;
