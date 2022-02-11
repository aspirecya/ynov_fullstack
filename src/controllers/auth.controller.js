const User = require('../models/user.model');
const userValidationSchema = require("../utils/validators/user.validation");
const jwtService = require('../services/jwt.service');
const geocodingService = require('../services/geocoding.service');
const bcrypt = require('bcrypt');

exports.register = (req, res, err) => {
    const validation = userValidationSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).send({
            message: "The data you entered are incorrect, please try again."
        });
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

    if (req.body.address) {
        geocodingService.geocodeUser(user, req.body.address);
    }

    user.save()
        .then(data => {
            console.log("[DEBUG] User " + req.body.email + " has registered.");
            res.send({
                success: true,
                message: "User successfully registered.",
                token: jwtService.generateJwtToken(user),
                expiration: jwtService.getJwtExpiration()
            });
        })
        .catch(err => {
            let messageString = "";
            if (err.code === 11000) {
                messageString = "The entered email is already registered."
            } else {
                messageString = "The information entered are incorrect."
            }

            console.log("[AUTH REGISTER ERROR]", err);
            res.status(500).send({
                success: false,
                message: messageString
            })
        })
};

exports.getUserById = (req, res) => {
    User.findById({_id: req.params.id}, (err, user) => {
        if (err) {
            console.log('[LOG] USER FETCH FAILURE, SEE ERROR LOG:');
            console.log(err);
        }

        res.send(user);
    })
};

exports.login = (req, res, err) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).send({
                    success: false,
                    message: "The information entered are incorrect."
                });
            }

            res.send({
                success: true,
                message: "User successfully logged in.",
                token: jwtService.generateJwtToken(user),
                expiration: jwtService.getJwtExpiration()
            });
        })
        .catch(err => {
            console.log("[AUTH LOGIN ERROR]", err);
            return res.status(500).send({
                success: false,
                message: "The information entered are incorrect."
            });
        });
};