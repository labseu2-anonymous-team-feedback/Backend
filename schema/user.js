const { gql } = require('apollo-server-express');

const userTypes = gql`
type Query {
    getAllUsers: [User!]!
    getUserById(userId: String!): User!
}
type User {
    id: String!
    username: String!
    email: String!
    password: String!
    surveys: [Survey!]!
}

type Mutation {
<<<<<<< HEAD
    userLogin(email: String!, password: String!): LoginResponse
    createAccount(
    username: String!
    email: String!
    password: String!
): createAccountResponse

  }

type LoginResponse {
    id: String
    username: String
    email: String
    token: String
  }
=======
    createAccount(
    username: String
    email: String!
    password: String!
): createAccountResponse
}
>>>>>>> Implement User Datasource
type createAccountResponse {
    id: String
    username: String
    email: String
}
`;

module.exports = userTypes;
