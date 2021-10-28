const express = require('express');
const router = express.Router();
const order = require('../controllers/order.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/orders/', order.create);
router.get('/orders/', verifyAuth, order.findAll);
router.get('/order/:id', verifyAuth, order.findById);
router.get('/orders/seller/:id', verifyAuth, order.findBySellerId);
router.get('/orders/buyer/:id', verifyAuth, order.findByBuyerId);
router.get('/order/product/:id', verifyAuth, order.findByProductId);
router.patch('/order/:id', verifyAuth, order.findByIdAndUpdate);
router.delete('/order/:id', verifyAuth, order.findByIdAndRemove);

module.exports = router;