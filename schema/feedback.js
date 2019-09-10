const { gql } = require('apollo-server-express');

const feedbackTypes = gql`
  type Query {
    getSurveyFeedback(surveyId: String!): Survey!
  }
  type Feedback {
    id: String
    author: User!
    survey: Survey!
    question: Question!
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
