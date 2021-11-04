const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const userValidationSchema = require("../utils/validators/user.validation");
const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const {Client} = require("@googlemaps/google-maps-services-js");

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

exports.findByTokenAndUpdate = (req, res) => {
    let user = jwt.verify(req.headers['x-access-token'], jwtConfig.secret).id;
    if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.findByIdAndUpdate(user, req.body, { new: true })
    .then(user => {
        if(req.body.address) {
            const client = new Client({});

            client.geocode({
                params: {
                    key: process.env.GOOGLE_MAP_KEY,
                    address: req.body.address,
                    region: 'fr',
                }
            })
            .then((r) => {
                user.geocoding.latitude = r.data.results[0].geometry.location.lat;
                user.geocoding.longitude = r.data.results[0].geometry.location.lng;
                user.save();
                console.log(user);
            })
            .catch((e) => {
                    console.log(e);
            });
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
