const stripe = require('stripe')(process.env.STRIPE_KEY);
const Order = require('../models/order.model');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

exports.create = async (req, res, err) => {
    const order = new Order({
        user: req.body.user,
        products: req.body.products,
        totalPrice: req.body.totalPrice,
        status: req.body.status
    });

    // try {
    //     await stripe.charges.create({
    //         source: req.body.stripeToken,
    //         currency: 'eur',
    //         amount: req.body.totalPrice,
    //         description: `Order ${new Date()} by ${req.body.user}`,
    //     });
    // } catch(err) {
    //     console.log(err);
    // }

    order.save()
        .then(data => {
            order.status = "processed";
            order.save();
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
};

exports.findAll = (req, res) => {
    Order.find()
        .populate('user')
        .populate('products')
        .then(orders => {
            res.send(orders);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching all orders."
            })
        })
};

exports.findByUserId = (req, res) => {
    Order.find({ user: req.params.id })
        .populate('products')
        .then(order => {
            res.send(order)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the order."
            })
        })
};

exports.findById = (req, res) => {
    Order.findById(_id = req.params.id)
        .populate('products')
        .populate('user')
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
        .populate('products')
        .populate('user')
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