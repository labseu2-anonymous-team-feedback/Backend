const { gql } = require('apollo-server-express');

const surveyTypes = gql`
  type Query {
    getUserSurveys: [Survey!]!
    getSurveyQuestions(surveyId: String!): [Question!]!
    getSurveyFeedback(surveyId: String!): [Feedback!]!
  }
  type Survey {
    id: String!
    title: String!
    owner: User!
    questions: [Question!]!
  }

  type Mutation {
    createNewSurvey(input: SurveyInput!): SurveyResponse
  }
  type Question {
    id: String!
    question: String!
    type: String
    survey: Survey!
  }
  input SurveyInput {
    """
    The title of the survey
    """
    title: String!
    """
    The array of question objects
    """
    questions: [QuestionInput!]!
  }
  input QuestionInput {
    question: String!
    type: String
  }
  type QuestionResponse {
    id: String
    question: String
    type: String
  }
  type Feedback {
    id: String
    userId: String
    surveyId: String!
    questionId: String!
    comment: String
    rating: String
  }

  type SurveyResponse {
    id: String
    title: String!
    questions: [QuestionResponse]
  }
`;

module.exports = surveyTypes;
