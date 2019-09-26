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
    firstName: String
    lastName: String
    profileImage: String
    surveys: [Survey!]!
  }

  type Mutation {
    userLogin(email: String!, password: String!): LoginResponse
    createAccount(
      username: String!
      email: String!
      password: String!
    ): createAccountResponse
    authGoogle: AuthResponse
    verifyAccount(token: String!): LoginResponse!
    sendResetPasswordEmail(email: String!): SendResetPasswordEmailResponse!
    resetPassword(
      newPassword: String!
      token: String!
    ): SendResetPasswordEmailResponse!
  }
  type SendResetPasswordEmailResponse {
    message: String!
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
    profileImage: String
    token: String
  }
`;

module.exports = userTypes;
