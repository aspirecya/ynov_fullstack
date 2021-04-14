const {gql} = require('apollo-server-express');

module.exports = gql`
    type Order {
        id: ID!
        user: User
        products: [Product]
        totalPrice: Float
    }
    extend type Query {
        orders: [Order]
        order(id: ID): Order
    }
    extend type Mutation {
        createOrder(user: ID, totalPrice: Float, products: [ID]): Order,
    }
`;
