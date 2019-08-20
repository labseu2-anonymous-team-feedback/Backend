const { gql } = require('apollo-server-express');

const surveyTypes = gql`
  type Query {
    getAllSurveys: [Survey!]!
  }
  type Survey {
    id: String!
    title: String!
    owner: User!
  }

  type Mutation {
    createNewSurvey(title: String, userId: String!): Survey
  }
`;

module.exports = surveyTypes;
