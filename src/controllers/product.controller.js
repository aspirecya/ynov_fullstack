const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const Product = require('../models/product.model');

exports.create = (req, res, err) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    if(!user) {
        return res.status(400).send({
            added: false,
            message: "The login token is expired or invalid."
        })
    }

    const product = new Product({
        seller: user,
        buyers: [],
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        size: req.body.size,
        price: req.body.price,
        categories: req.body.categories,
        image: req.body.image,
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

exports.getUserProducts = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    if(!user) {
        return res.status(400).send({
            added: false,
            message: "The login token is expired or invalid."
        })
    }

    Product.find({ seller: user })
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.getProductBuyers = (req, res) => {
    Product.findById(_id = req.params.id)
        .populate('buyers')
        .then(product => {
            res.send(product.buyers);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the product's buyers."
            })
        })
}
