const { gql } = require('apollo-server-express');

const productSchema = require('./product.schema.js');
const userSchema = require('./user.schema.js');
const orderSchema = require('./order.schema.js');
const categorySchema = require('./category.schema.js');

const linkSchema = gql`
    type Query {
        _:Boolean
    }
    type Mutation {
        _: Boolean
    }
`;

module.exports = [linkSchema, productSchema, userSchema, orderSchema, categorySchema]

