const {gql} = require('apollo-server-express');

module.exports = gql`
    type User {
        id: ID!
        email: String
        password: String
        firstname: String
        lastname: String
        phone: String
        address: String
        admin: Boolean
    }
    extend type Query {
        users: [User]
        user(id: ID!): User
    }
    extend type Mutation {
        createUser(email: String, password: String, firstname: String, lastname: String, phone: String, address: String, admin: Boolean): User,
        updateUser(id: ID!, email: String, password: String, firstname: String, lastname: String, phone: String, address: String, admin: Boolean): User,
        deleteUser(id:ID!): User
    }
`;
