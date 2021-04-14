const {gql} = require('apollo-server-express');

module.exports = gql`
  type Product {
    id: ID!
    title: String!
    description: String
    price: Float!
    categories: [Category]
    image: String
  }
  extend type Query {
    products: [Product]
    product(id: ID!): Product
  }
  extend type Mutation {
      createProduct(title: String, description: String, price: Float, categories: [ID], image: String): Product,
      updateProduct(title: String, description: String, price: Float, categories: [ID], image: String): Product,
      deleteProduct(id:ID!): Product
  }
`;
