const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const orderRouter = require('./order.route');
const productRouter = require('./product.route');

router.use(authRouter);
router.use(userRouter);
router.use(orderRouter);
router.use(productRouter);

module.exports = router;
