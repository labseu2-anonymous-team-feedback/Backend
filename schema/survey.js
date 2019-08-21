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
    createNewSurvey(title: String!): Survey
  }
`;

module.exports = surveyTypes;
