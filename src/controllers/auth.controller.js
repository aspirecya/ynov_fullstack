const User = require('../models/user.model');
const jwtConfig = require('../configs/jwt.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userValidationSchema = require("../utils/validators/user.validation");
const moment = require('moment');
const {Client} = require("@googlemaps/google-maps-services-js");


exports.register = (req, res, err) => {
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
        })
        .catch((e) => {
            console.log(e);
        });
    }

    user.save()
        .then(data => {
            console.log("[DEBUG] User " + req.body.email + " has registered.");
            let userToken = jwt.sign(
                {
                    id: user._id,
                    admin: user.admin
                },
                jwtConfig.secret,
                {
                    expiresIn: 86400
                }
            );
            res.send({
                success: true,
                message: "User successfully registered.",
                token: userToken
            });
        })
        .catch(err => {
            console.log("[AUTH REGISTER ERROR]", err);
            res.status(500).send({
                success: false,
                message: "The information entered are incorrect."
            })
        })
};

exports.getUserById = (req, res) => {
    User.findById({ _id : req.params.id }, (err, user) => {
        if(err) {
            console.log('[LOG] USER FETCH FAILURE, SEE ERROR LOG:');
            console.log(err);
        }

        res.send(user);
    })
};

exports.login = (req, res, err) => {
    let date = moment();
    date.add(process.env.JWT_EXPIRATION.replace(/\D/g,''), process.env.JWT_EXPIRATION.replace(/\d/g,''));

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).send({
                    success: false,
                    message: "The information entered are incorrect."
                });
            }

            let userToken = jwt.sign(
                {
                    id: user._id,
                    admin: user.admin,
                },
                jwtConfig.secret,
                {
                    expiresIn: process.env.JWT_EXPIRATION,
                }
            );

            res.send({
                success: true,
                message: "User successfully logged in.",
                token: userToken,
                expiration: date
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