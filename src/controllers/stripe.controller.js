const jwt = require('jsonwebtoken');
const moment = require('moment');
const jwtConfig = require('../configs/jwt.config');
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.createPaymentIntent = async (req, res, err) => {
    const intent = await stripe.paymentIntents.create({
        amount: req.body.price * 100,
        currency: 'eur',
        payment_method_types: [
            'card',
            'sepa_debit'
        ],
    });

    res.status(400).send({
        clientSecret: intent.client_secret,
    })
};

exports.webhook = async (req, res, err) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_KEY);
        console.log(event);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            console.log(paymentIntent);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}