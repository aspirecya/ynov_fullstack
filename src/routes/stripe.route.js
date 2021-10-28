const express = require('express');
const router = express.Router();
const stripe = require('../controllers/stripe.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/stripe/create-payment-intent', stripe.createPaymentIntent);
router.post('/stripe/webhook', stripe.webhook);

module.exports = router;
