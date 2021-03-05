const Order = require('../../models/order.model');

module.exports = {
    Query: {
        orders: () => {
            return Order
                .find()
                .populate('user')
                .populate('products');
        },
        order: (parent, args) => {
            console.log(args.id);
            return Order.findById(args.id)
        },
    },
    Mutation: {
        createOrder: (parent, args) => {
            const newOrder = new Order({
                user: args.user,
                totalPrice: args.totalPrice,
                products: args.product
            });

            return newOrder.save();
        },
    },
};
