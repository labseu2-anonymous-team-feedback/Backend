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
`;

module.exports = userTypes;
