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
        category: req.body.category,
        image: req.body.image,
    });

    product.save()
        .then(product => {
            res.status(200).send({
                success: true,
                message: "Product has been created.",
                product: product
            });
        })
        .catch(err => {
            console.log("[PRODUCT CREATE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while creating the product."
            })
        })
};

exports.findAll = (req, res) => {
    Product.find({ isActive: true })
        .populate('category')
        .then(product => {
            res.status(200).send({
                success: true,
                message: "Products have been fetched.",
                product: product
            });
        })
        .catch(err => {
            console.log("[PRODUCT FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching all product."
            })
        })
};

exports.findById = (req, res) => {
    Product.findById(_id = req.params.id)
        .populate('category')
        .then(product => {
            res.status(200).send({
                success: true,
                message: "Product has been fetched.",
                product: product
            });
        })
        .catch(err => {
            console.log("[PRODUCT FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching the product."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(product => {
            res.status(200).send({
                success: true,
                message: "Product has been updated.",
                product: product
            });
        })
        .catch(err => {
            console.log("[PRODUCT UPDATE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while updating the product."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            res.status(200).send({
                success: true,
                message: "Product has been deleted.",
                product: product
            });
        })
        .catch(err => {
            console.log("[PRODUCT DELETE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while deleting the product."
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
            success: false,
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

exports.addBuyerToProduct = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    Product.findById(_id = req.params.id)
        .then(product => {
            product.buyers.push(user);
            product.save();

            res.send(product);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the product's buyers."
            })
        })
}

exports.productHasBuyerId = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    Product.findById(_id = req.params.id)
        .then(product => {
            res.send(product.buyers.includes(user));
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the product's buyers."
            })
        })
}