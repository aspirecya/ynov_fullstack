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
        status: "En attente de paiement",
        returnDate: todayDate.add('15', 'd')
    });

    order.save()
        .then(order => {
            order.populate('product', function (err) {
                order.price = order.product.price;
                order.product.isActive = false;
                order.product.isAwaitingPayment = true;

                order.product.save();
                order.save();

                res.status(200).send({
                    success: true,
                    message: "The buyer has been confirmed.",
                    order: order
                });
            });
        })
        .catch(err => {
            console.log("[ORDER CREATE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error occurred while selecting the buyer."
            })
        })
};

exports.findAll = (req, res) => {
    Order.find()
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(order => {
            res.status(200).send({
                success: true,
                message: "Orders have been fetched.",
                order: order
            });
        })
        .catch(err => {
            console.log("[ORDER FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching all orders."
            })
        })
};

exports.findById = (req, res) => {
    Order.findById(_id = req.params.id)
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(order => {
            res.status(200).send({
                success: true,
                message: "Order has been fetched.",
                order: order
            });
        })
        .catch(err => {
            console.log("[ORDER FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching the order."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(order => {
            res.status(200).send({
                success: true,
                message: "Order has been updated.",
                order: order
            });
        })
        .catch(err => {
            console.log("[ORDER UPDATE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while updating the order."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(order => {
            res.status(200).send({
                success: true,
                message: "Order has been deleted.",
                order: order
            });
        })
        .catch(err => {
            console.log("[ORDER DELETE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while deleting the order."
            })
        })
};

exports.findBySellerId = (req, res) => {
    let query = {
        buyer: req.params.id
    }

    if(req.params.status) {
        query.status = req.params.status;
    }

    Order.find(query)
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(orders => {
            res.status(200).send({
                success: true,
                orders: orders
            });
        })
        .catch(err => {
            console.log("[ORDER FINDBYSELLERID ERROR]", err);
            res.status(500).send({
                success: false,
            })
        })
};

exports.findByBuyerId = (req, res) => {
    let query = {
        buyer: req.params.id
    }

    if(req.params.status) {
        query.status = req.params.status;
    }

    Order.find(query)
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(orders => {
            console.log(req.params.status)

            res.status(200).send({
                success: true,
                orders: orders
            });
        })
        .catch(err => {
            console.log("[ORDER FINDBYBUYERID ERROR]", err);
            res.status(500).send({
                success: false,
            })
        })
};

exports.findByProductId = (req, res) => {
    Order.find({ product: req.params.id })
        .populate('seller')
        .populate('buyer')
        .populate('product')
        .then(order => {
            res.status(200).send({
                success: true,
                order: order
            });
        })
        .catch(err => {
            console.log("[ORDER FINDBYPRODUCTID ERROR]", err);
            res.status(500).send({
                success: false,
            })
        })
};
