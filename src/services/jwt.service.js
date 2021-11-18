const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwt.config");

exports.generateJwtToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin
        },
        jwtConfig.secret,
        {
            expiresIn: 86400
        }
    );
}

exports.getJwtExpiration = () => {
    let date = moment();
    date.add(process.env.JWT_EXPIRATION.replace(/\D/g, ''), process.env.JWT_EXPIRATION.replace(/\d/g, ''));

    return date;
}