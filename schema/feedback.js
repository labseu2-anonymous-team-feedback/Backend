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
  input FeedbackInput {
    id: String
    userId: String
    surveyId: String!
    questionId: String!
    comment: String
    rating: String
  }

  type Mutation {
    saveFeedback(input: FeedbackInputArray!): FeedbackResponse!
  }
  input FeedbackInputArray {
    responses: [FeedbackInput!]!
  }
  type FeedbackResponse {
    message: String!
  }
`;

module.exports = feedbackTypes;
