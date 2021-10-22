const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 128
        },
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        admin: {
            type: Boolean
        },
        wishlist: [{
            type: Schema.Types.ObjectId, ref: 'Product'
        }],
        geocoding: {
            latitude: { type: mongoose.Decimal128 },
            longitude: { type: mongoose.Decimal128 },
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
