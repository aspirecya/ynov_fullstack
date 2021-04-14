const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const userValidationSchema = require("../utils/validators/user.validation");

exports.create = (req, res, err) => {
    const validation = userValidationSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error);
    }

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
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
            res.status(500).send({
                message: err.message
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

exports.findById = (req, res) => {
    User.findById(_id = req.params.id)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred while fetching the user."
            })
        })
};

exports.findByIdAndUpdate = (req, res) => {
    if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
        res.send(user)
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