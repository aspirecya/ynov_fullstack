const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const orderRouter = require('./order.route');
const productRouter = require('./product.route');
const categoryRouter = require('./category.route');

router.use(authRouter);
router.use(userRouter);
router.use(orderRouter);
router.use(productRouter);
router.use(categoryRouter);

module.exports = router;
