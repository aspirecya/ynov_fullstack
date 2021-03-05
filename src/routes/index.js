const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const orderRouter = require('./order.route');

router.use(authRouter);
router.use(userRouter);
router.use(orderRouter);

module.exports = router;
