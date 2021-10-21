const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const Category = require('../models/category.model');

exports.create = (req, res, err) => {
    const category = new Category({
        name: req.body.name,
        image: req.body.image
    });

    category.save()
        .then(category => {
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
};

exports.findAll = (req, res) => {
    Category.find()
        .then(categories => {
            res.send(categories);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching all categories."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(category => {
            res.send(category)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while updating the category."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(category => {
            res.send(category);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while deleting the category."
            })
        })
};