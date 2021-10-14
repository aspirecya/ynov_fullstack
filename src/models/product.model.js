const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
    categories: {
        type: Array
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);