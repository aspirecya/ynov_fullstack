const Product = require('../models/product.model');
const bcrypt = require('bcrypt');

exports.create = (req, res, err) => {
    const product = new Product({
        seller:req.body.seller,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        categories: req.body.categories,
        image: req.body.image
    });

    product.save()
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
    Product.find()
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching all products."
            })
        })
};

exports.findById = (req, res) => {
    Product.findById(_id = req.params.id)
        .then(product => {
            res.send(product)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the product."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(product => {
            res.send(product)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while updating the product."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while deleting the product."
            })
        })
};

exports.getAllCategories = (req, res) => {
    let categories = [];
    Product.find()
        .then(products => {
            products.forEach(product => {
                product.categories.forEach(category => {
                    categories.push(category);
                })
            })

            res.send(categories);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
};

exports.getProductBuyer = (req, res) => {
    Product.findById(_id = req.params.id)
        .then(product => {
            res.send(product.buyer)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the product."
            })
        })
}
