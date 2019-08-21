const { gql } = require('apollo-server-express');

const userTypes = gql`
type Query {
    getAllUsers: [User!]!
}
type User {
    id: String!
    username: String!
    email: String!
    password: String!
    surveys: [Survey!]!
}

type Mutation {
    userLogin(email: String!, password: String!): LoginResponse
  }

type LoginResponse {
    id: String
    username: String
    email: String
    token: String
  }
`;

module.exports = userTypes;
