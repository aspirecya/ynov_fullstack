const {gql} = require('apollo-server-express');

module.exports = gql`
    type Category {
        id: ID!
        title: String!
        products: [Product]
    }
    extend type Query {
        categories: [Category]
        category(id: ID!): Category
    }
    extend type Mutation {
        createCategory(title: String, products:[ID]): Category,
        updateCategory(id:ID!, title: String, products:[ID]): Category,
        deleteCategory(id:ID!): Category
    }
`;
