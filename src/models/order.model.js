const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
        seller: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        buyer: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId, ref: 'Product'
        },
        totalPrice: {
            type: Number,
        },
        status: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);