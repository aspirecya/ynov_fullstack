const stripe = require('stripe')(process.env.STRIPE_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;
const Order = require('../models/order.model');
const moment = require('moment');
const {ORDER_PROCESSING, ORDER_SUCCESS, ORDER_CANCELLED} = require("../configs/constants.config");

exports.createPaymentIntent = async (req, res, err) => {
    console.log("📄 LOGGING INTENT START 📄");
    try {
        console.log("📄 LOGGING INTENT BODY 📄", req.body)
        const intent = await stripe.paymentIntents.create({
            amount: req.body.price * 100,
            currency: 'eur',
            payment_method_types: [
                'card',
                'sepa_debit'
            ],
            metadata: {
                order: req.body.order,
            }
        });
        console.log("📄 LOGGING INTENT INTENT 📄", intent)


        res.status(200).send({
            success: true,
            clientSecret: intent.client_secret,
        })
    } catch (err) {
        console.log('[STRIPE PAYMENT INTENT CREATE]', err);

        res.status(400).send({
            success: false,
        })
    }
    console.log("📄 LOGGING INTENT END 📄");
};

exports.webhook = async (req, res, err) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        res.status(400).send(`❌ Webhook Error ❌: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.created':
            const created = event.data.object;
            handleIntentCreation(created);
            break;
        case 'payment_intent.canceled':
            const cancelled = event.data.object;
            handleIntentCancellation(cancelled);
            break;
        case 'payment_intent.succeeded':
            const succeeded = event.data.object;
            handleIntentSuccess(succeeded);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}

function handleIntentCreation(created) {
    Order.findById(_id = created.metadata.order)
        .then(order => {
            order.status = ORDER_PROCESSING;
        })
        .catch(err => {
            console.log("[❌ ERROR INTENT CREATION]", err);
        })
}

function handleIntentSuccess(created) {
    Order.findById(_id = created.metadata.order)
        .then(order => {
            order.status = ORDER_SUCCESS;
            order.returnDate = moment().add('15', 'd');

            order.populate('product', async function (err) {
                order.product.isAwaitingPayment = false;
                order.product.buyers = [
                    order.buyer,
                ];
                order.product.save();
            })

            order.save();
        })
        .catch(err => {
            console.log("[❌ ERROR INTENT SUCCESS]", err);
        })
}

function handleIntentCancellation(created) {
    Order.findById(_id = created.metadata.order)
        .then(order => {
            order.status = ORDER_CANCELLED;

            order.populate('product', async function (err) {
                order.product.isAwaitingPayment = false;
            })

            order.product.save();
            order.save();
        })
        .catch(err => {
            console.log("[❌ ERROR INTENT SUCCESS]", err);
        })
}