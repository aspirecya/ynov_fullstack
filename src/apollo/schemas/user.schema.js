const {gql} = require('apollo-server-express');

module.exports = gql`
    type User {
        id: ID!,
        email: String,
        password: String,
        firstname: String,
        lastname: String
    }
    extend type Query {
        users: [User]
        user(id: ID!): User
    }
    extend type Mutation {
        createUser(email: String, password: String, firstname: String, lastname: String): User,
    }
`;
