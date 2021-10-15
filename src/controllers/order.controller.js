const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs/jwt.config');
const Order = require('../models/order.model');
const moment = require('moment');

exports.create = async (req, res, err) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;
    let todayDate = moment();

    const order = new Order({
        seller: user,
        buyer: req.body.buyer,
        product: req.body.product,
        status: "En cours",
        returnDate: todayDate.add('15', 'd')
    });
    console.log(await order.populate('product'));

    order.save()
        .then(order => {
            order.populate('product', function (err) {
                order.price = order.product.price;
                order.product.isActive = false;
                order.save();

                res.send(order);
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
};

exports.findAll = (req, res) => {
    Order.find()
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(orders => {
            res.send(orders);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching all orders."
            })
        })
};

exports.findById = (req, res) => {
    Order.findById(_id = req.params.id)
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(order => {
            res.send(order)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the order."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(order => {
            res.send(order)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while updating the order."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(order => {
            res.send(order);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while deleting the order."
            })
        })
};

exports.findBySellerId = (req, res) => {
    Order.find({ seller: req.params.id })
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(orders => {
            res.send(orders)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the order."
            })
        })
};

exports.findByBuyerId = (req, res) => {
    Order.find({ buyer: req.params.id })
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(orders => {
            res.send(orders)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the order."
            })
        })
};
