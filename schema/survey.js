const { gql } = require('apollo-server-express');

const surveyTypes = gql`
  type Query {
    getUserSurveys: [Survey!]!
  }
  type Survey {
    id: String!
    title: String!
    owner: User!
  }

  type Mutation {
    createNewSurvey(input: SurveyInput): SurveyResponse
  }
  type Question {
    id: String!
    question: String!
    type: String
    survey: Survey!
  }
  input SurveyInput {
    title: String!
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

  type SurveyResponse {
    id: String
    title: String!
    questions: [QuestionResponse]
  }
`;

module.exports = surveyTypes;
