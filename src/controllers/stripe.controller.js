const stripe = require('stripe')(process.env.STRIPE_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

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
    console.log('📄 LOG SIGNATURE', sig);

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        res.status(400).send(`❌ Webhook Error ❌: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.canceled':
            const cancelled = event.data.object;
            // Then define and call a function to handle the event payment_intent.canceled
            console.log('❌ intent cancel', cancelled);
            break;
        case 'payment_intent.succeeded':
            const succeeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            console.log('✅ intent success', succeeded);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}