const express = require('express');
const router = express.Router();
const stripe = require('../controllers/stripe.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/create-payment-intent', stripe.createPaymentIntent);

module.exports = router;
