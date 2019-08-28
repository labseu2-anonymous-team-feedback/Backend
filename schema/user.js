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
    userLogin(email: String!, password: String!): LoginResponse
    createAccount(
      username: String!
      email: String!
      password: String!
    ): createAccountResponse
    authGoogle(googleAccessToken: AuthInput!): AuthResponse
    verifyAccount(token: String!): LoginResponse!
  }

  type LoginResponse {
    id: String
    username: String
    email: String
    token: String
    verified: Boolean
  }
  type createAccountResponse {
    id: String
    username: String
    email: String
  }

  type AuthResponse {
    id: String
    username: String
    email: String
    token: String
  }

  input AuthInput {
    accessToken: String!
  }
`;

module.exports = userTypes;
