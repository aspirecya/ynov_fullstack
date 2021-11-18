const Category = require('../models/category.model');
const Product = require("../models/product.model");

exports.create = (req, res, err) => {
    const category = new Category({
        name: req.body.name,
        image: req.body.image
    });

    category.save()
        .then(category => {
            res.status(200).send({
                success: true,
                message: "Category has been created.",
                category: category
            });
        })
        .catch(err => {
            console.log("[CATEGORY CREATE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error occurred while creating the category."
            });
        })
};

exports.findAll = (req, res) => {
    Category.find()
        .then(category => {
            res.status(200).send({
                success: true,
                message: "Categories have been fetched.",
                category: category
            });
        })
        .catch(err => {
            console.log("[CATEGORY FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching all categories."
            })
        })
};

exports.findById = (req, res) => {
    Category.findById(_id = req.params.id)
        .then(category => {
            res.status(200).send({
                success: true,
                message: "Category has been fetched.",
                category: category
            });
        })
        .catch(err => {
            console.log("[CATEGORY FETCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while fetching the category."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    console.log("DEBUG REGIS ❌:", req.params, req.body);
    Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(category => {
            res.status(200).send({
                success: true,
                message: "Category have been updated.",
                category: category
            });
        })
        .catch(err => {
            console.log("[CATEGORY PATCH ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while updating the category."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(category => {
            res.status(200).send({
                success: true,
                message: "Category has been deleted.",
                category: category
            });
        })
        .catch(err => {
            console.log("[CATEGORY DELETE ERROR]", err);
            res.status(500).send({
                success: false,
                message: "An error has occurred while deleting the category."
            })
        })
};