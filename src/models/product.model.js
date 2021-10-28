const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    buyers: [{
        type: Schema.Types.ObjectId, ref: 'User',
    }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category',
    },
    image: {
        type: Array,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isAwaitingPayment: {
        type: Boolean,
        required: true,
        default: false,
    },
    geocoding: {
        latitude: mongoose.Decimal128,
        longitude: mongoose.Decimal128,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);