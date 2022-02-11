const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const userValidationSchema = require("../utils/validators/user.validation");
const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const geocodingService = require('../services/geocoding.service');

exports.create = (req, res, err) => {
    const validation = userValidationSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error);
    }

    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        phone: req.body.phone,
        admin: false,
    });

    user.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            let messageString = "";
            if (err.code === 11000) {
                messageString = "The entered email is already registered."
            } else {
                messageString = "The information entered are incorrect."
            }

            res.status(500).send({
                message: messageString
            })
        })
};

exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching all users."
            })
        })
};

exports.findByToken = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    User.findById(_id = user)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the user."
            })
        })
};

exports.findById = (req, res) => {
    User.findById(_id = req.params.id)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: "An error has occurred while fetching the user."
            })
        })
};

exports.findAndUpdate = (req, res) => {
    let user;

    if (req.params.id) {
        user = req.params.id
    } else {
        user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;
    }

    if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.findByIdAndUpdate(user, req.body, {new: true})
        .then(user => {
            if (req.body.address) {
                geocodingService.geocodeUser(user, req.body.address);
            }

            res.status(200).send({
                success: true,
                message: "Account has been updated.",
                user: user
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while updating the user."
            })
        })
};

exports.findByIdAndRemove = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while deleting the user."
            })
        })
};

exports.isAdmin = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;

    User.findById(user)
        .then(user => {
            res.status(200).send(user.admin);
        })
        .catch(err => {
            res.status(500);
        })
}
