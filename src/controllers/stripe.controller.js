const stripe = require('stripe')(process.env.STRIPE_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

exports.createPaymentIntent = async (req, res, err) => {
    try {
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

        res.status(200).send({
            success: true,
            clientSecret: intent.client_secret,
        })
    } catch(err) {
        console.log('[STRIPE PAYMENT INTENT CREATE]', err);

        res.status(400).send({
            success: false,
        })
    }
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
            console.log('📃 LOG CREATED:', created);
            break;
        case 'payment_intent.canceled':
            const cancelled = event.data.object;

            break;
        case 'payment_intent.succeeded':
            const succeeded = event.data.object;

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}