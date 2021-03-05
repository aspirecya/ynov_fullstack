const User = require('../models/user.model');
const jwtConfig = require('../configs/jwt.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userValidationSchema = require("../utils/validators/user.validation");

exports.register = (req, res, err) => {
    const validation = userValidationSchema.validate(req.body);

    console.log(validation);
    if (validation.error) {
        return res.status(400).send(validation.error);
    }

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        admin: false,
    });

    user.save()
        .then(data => {
            console.log("[DEBUG] User " + req.body.email + " has registered.");
            let userToken = jwt.sign(
                {
                    id: user.email,
                    admin: user.admin
                },
                jwtConfig.secret,
                {
                    expiresIn: 86400
                }
            );
            res.send({
                auth: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    token: userToken
                }
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
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
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).send({
                    error: "The information entered are incorrect."
                });
            }
            let userToken = jwt.sign(
                {
                    id: user.email,
                    admin: user.admin
                },
                jwtConfig.secret,
                {
                    expiresIn: 86400
                }
            )
            res.send({
                auth: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    token: userToken
                }
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: err || "An error occurred when logging in."
            });
    });
};