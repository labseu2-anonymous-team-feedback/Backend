const { gql } = require('apollo-server-express');

const surveyTypes = gql`
type Query {
    getAllSurveys: [User!]!
}
type Survey {
    id: String!
    title: String!
    owner: User!
}

type Mutation {
    createNewSurvey(
    title: String
    userId: String!
    )
}


`;

module.exports = surveyTypes;
