const jwt = require('jsonwebtoken');
const moment = require('moment');
const jwtConfig = require('../configs/jwt.config');
const stripe = require('stripe')(process.env.STRIPE_KEY);


exports.createPaymentIntent = async (req, res, err) => {
    const intent = await stripe.paymentIntents.create({
        amount: req.body.price,
        currency: 'eur',
        payment_method_types: [
            'card'
        ],
    });

    res.status(400).send({
        clientSecret: intent.client_secret,
    })
};