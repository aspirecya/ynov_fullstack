const Order = require('../models/order.model');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

exports.create = (req, res, err) => {
    const order = new Order({
        userOrder: req.body.user,
        orderTotalPrice: req.body.total,
        orderProducts: req.body.products
    });

    order.save()
        .then(data => {
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
    Order.findByIdAndUpdate(req.params.id, req.body)
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