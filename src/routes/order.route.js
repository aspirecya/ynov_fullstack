const express = require('express');
const router = express.Router();

const order = require('../controllers/order.controller');

const verifyAuth = require('../utils/verifyAuth');
const verifyPerm = require('../utils/verifyPerm');

router.post('/orders/', order.create);
router.get('/orders/', verifyAuth, order.findAll);
router.get('/order/:id', verifyAuth, order.findById);
router.patch('/order/:id', verifyAuth, order.findByIdAndUpdate);
router.delete('/order/:id', verifyAuth, order.findByIdAndRemove);

module.exports = router;